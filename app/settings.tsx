import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

import { useBackupRepository } from "@/src/features/backup/data/useBackupRepository";
import { previewBackup, validateBackup } from "@/src/features/backup/domain/backup";
import { enableNotifications } from "@/src/features/notifications/data/notificationService";
import { isExpoGoAndroid } from "@/src/features/notifications/data/notificationPolicy";
import { useThemePreferences } from "@/src/shared/theme/ThemeProvider";
import { THEME_MODES, type ThemePreference } from "@/src/features/settings/domain/settings";
import { PageHero } from "@/src/shared/ui/PageHero";
import { Screen } from "@/src/shared/ui/Screen";
import { Card } from "@/src/shared/ui/Card";
import { FeedbackBanner, type FeedbackVariant } from "@/src/shared/ui/FeedbackBanner";
import { Motion } from "@/src/shared/ui/Motion";
import { radii, spacing } from "@/src/shared/theme/tokens";
import Constants from "expo-constants";

export default function SettingsScreen() {
  const { colors, settings, updateSettings } = useThemePreferences();
  const backupRepository = useBackupRepository();
  const [feedback, setFeedback] = useState<{ message: string; variant: FeedbackVariant } | null>(null);
  const [busy, setBusy] = useState<"export" | "import" | null>(null);
  const [showBackupDetails, setShowBackupDetails] = useState(false);
  const expoGoAndroid = isExpoGoAndroid(Platform.OS, Constants.appOwnership);

  function showFeedback(message: string, variant: FeedbackVariant = "success") { setFeedback({ message, variant }); }
  async function exportData() {
    if (busy) return;
    setBusy("export");
    try {
      const backup = await backupRepository.exportBackup();
      const uri = `${FileSystem.cacheDirectory}clarunio-backup-${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(uri, JSON.stringify(backup, null, 2));
      await Sharing.shareAsync(uri, { mimeType: "application/json", dialogTitle: "Compartir respaldo de Clarunio" });
      showFeedback("Respaldo preparado para compartir.");
    } catch (cause) { showFeedback(cause instanceof Error ? cause.message : "No se pudo exportar el respaldo.", "error"); }
    finally { setBusy(null); }
  }
  async function importData() {
    if (busy) return;
    setBusy("import");
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "application/json", copyToCacheDirectory: true, multiple: false });
      if (result.canceled || !result.assets?.[0]) { setBusy(null); return; }
      const json = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const backup = validateBackup(JSON.parse(json));
      const counts = previewBackup(backup);
      Alert.alert("Reemplazar datos actuales", `Se importarán ${counts.items} elementos y ${counts.projects} proyectos. Esta acción reemplazará todos los datos actuales de Clarunio.`, [
        { text: "Cancelar", style: "cancel", onPress: () => setBusy(null) },
        { text: "Reemplazar datos", style: "destructive", onPress: () => { void backupRepository.replaceFromJson(json).then(() => { setBusy(null); showFeedback("Importación completada."); }).catch((cause) => { setBusy(null); showFeedback(cause instanceof Error ? cause.message : "No se pudo importar el respaldo.", "error"); }); } }
      ]);
    } catch (cause) { setBusy(null); showFeedback(cause instanceof Error ? cause.message : "El respaldo no es válido.", "error"); }
  }
  async function toggleNotifications(value: boolean) {
    try {
      if (!value) { await updateSettings({ notificationsEnabled: false }); return; }
      if (expoGoAndroid) { showFeedback("Los recordatorios requieren un development build o APK compatible; Expo Go no incluye este módulo en Android.", "warning"); return; }
      const granted = await enableNotifications();
      await updateSettings({ notificationsEnabled: granted });
      showFeedback(granted ? "Recordatorios activados." : "Permiso de notificaciones denegado; la app sigue funcionando.", granted ? "success" : "warning");
    } catch (cause) { showFeedback(cause instanceof Error ? cause.message : "No se pudieron actualizar los recordatorios.", "error"); }
  }
  async function updatePreference(patch: Parameters<typeof updateSettings>[0]) { try { await updateSettings(patch); } catch (cause) { showFeedback(cause instanceof Error ? cause.message : "No se pudo guardar el ajuste.", "error"); } }
  return <Screen><PageHero title="Ajustes" subtitle="Configura Clarunio sin salir del dispositivo." />
      <Card><SectionHeading icon="color-palette-outline" title="Apariencia" subtitle="Haz que Clarunio se adapte a tu forma de usarlo." colors={colors} /><View accessibilityLabel="Elegir tema" accessibilityRole="radiogroup" style={styles.themeGrid}>{THEME_MODES.map((mode) => <ThemeOption key={mode} mode={mode} selected={settings.theme === mode} onPress={() => void updatePreference({ theme: mode as ThemePreference })} colors={colors} />)}</View><SettingRow colors={colors} icon="bulb-outline" title="Ayudas contextuales" subtitle="Muestra orientación breve dentro de la app cuando puede ayudarte." value={settings.contextualHelp} onValueChange={(value) => void updatePreference({ contextualHelp: value })} /><SettingRow colors={colors} icon="calendar-outline" title="Avisos de revisión" subtitle="Prepara recordatorios de revisión si el entorno los admite." value={settings.weeklyReviewReminders} onValueChange={(value) => void updatePreference({ weeklyReviewReminders: value })} /><SettingRow colors={colors} icon="notifications-outline" title="Recordatorios locales" subtitle="Requiere un development build o APK compatible para funcionar." value={settings.notificationsEnabled} disabled={expoGoAndroid} warning={expoGoAndroid ? "No disponible en Expo Go para Android." : undefined} onValueChange={(value) => void toggleNotifications(value)} /></Card>
     <Card><SectionHeading icon="shield-checkmark-outline" title="Datos" subtitle="Tus respaldos se preparan y validan en este dispositivo." colors={colors} /><DataAction icon="share-outline" title="Exportar respaldo" description="Crea un JSON completo para guardarlo o compartirlo." tone="safe" busy={busy === "export"} disabled={Boolean(busy)} onPress={() => void exportData()} colors={colors} /><DataAction icon="warning-outline" title="Importar y reemplazar" description="Valida un respaldo y reemplaza explícitamente los datos actuales." tone="danger" busy={busy === "import"} disabled={Boolean(busy)} onPress={() => void importData()} colors={colors} /><Pressable accessibilityRole="button" accessibilityState={{ expanded: showBackupDetails }} accessibilityLabel="Cómo funcionan los respaldos" onPress={() => setShowBackupDetails((current) => !current)} style={styles.detailsToggle}><Text style={{ color: colors.primary, fontWeight: "800" }}>Cómo funcionan los respaldos</Text><Ionicons color={colors.primary} name={showBackupDetails ? "chevron-up" : "chevron-down"} size={20} /></Pressable>{showBackupDetails ? <Motion><View style={[styles.detailsPanel, { backgroundColor: colors.surfaceSoft }]}><Ionicons color={colors.primary} name="lock-closed-outline" size={20} /><Text style={[styles.detailsText, { color: colors.textSecondary }]}>Importar siempre muestra una vista previa y pide confirmación. Si la validación o la transacción falla, tus datos actuales no se reemplazan.</Text></View></Motion> : null}</Card>
     {feedback ? <FeedbackBanner message={feedback.message} variant={feedback.variant} onDismiss={() => setFeedback(null)} /> : null}
   </Screen>;
}

type Colors = ReturnType<typeof useThemePreferences>["colors"];
function SectionHeading({ icon, title, subtitle, colors }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; colors: Colors }) { return <View style={styles.sectionHeading}><View style={[styles.sectionIcon, { backgroundColor: colors.primarySoft }]}><Ionicons color={colors.primary} name={icon} size={22} /></View><View style={styles.copy}><Text style={[styles.heading, { color: colors.text }]}>{title}</Text><Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text></View></View>; }
function ThemeOption({ mode, selected, onPress, colors }: { mode: ThemePreference; selected: boolean; onPress: () => void; colors: Colors }) { const labels = { system: "Sistema", light: "Claro", dark: "Oscuro" }; const icons = { system: "contrast-outline", light: "sunny-outline", dark: "moon-outline" } as const; return <Pressable accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={`Tema ${labels[mode]}`} onPress={onPress} style={[styles.themeOption, { backgroundColor: selected ? colors.primarySoft : colors.surfaceSoft, borderColor: selected ? colors.primary : colors.outline }]}><Ionicons color={selected ? colors.primary : colors.textSecondary} name={icons[mode]} size={21} /><Text style={[styles.themeLabel, { color: colors.text }]}>{labels[mode]}</Text>{selected ? <Ionicons accessibilityLabel="Seleccionado" color={colors.primary} name="checkmark-circle" size={18} /> : null}</Pressable>; }
function SettingRow({ colors, icon, title, subtitle, value, onValueChange, disabled = false, warning }: { colors: Colors; icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; value: boolean; onValueChange: (value: boolean) => void; disabled?: boolean; warning?: string }) { return <ToggleRow colors={colors} value={value}><View style={styles.settingIcon}><Ionicons color={disabled ? colors.textSecondary : colors.primary} name={icon} size={22} /></View><View style={styles.settingCopy}><Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text><Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>{warning ? <Text style={[styles.warningText, { color: colors.error }]}>{warning}</Text> : null}</View><Switch accessibilityLabel={title} accessibilityRole="switch" accessibilityState={{ checked: value, disabled }} disabled={disabled} value={value} onValueChange={onValueChange} trackColor={{ false: colors.outline, true: colors.primarySoft }} thumbColor={value ? colors.primary : colors.surface} /></ToggleRow>; }
function ToggleRow({ colors, value, children }: { colors: Colors; value: boolean; children: ReactNode }) { const reducedMotion = useReducedMotion(); const scale = useSharedValue(value ? 1 : 0.96); const animatedStyle = useAnimatedStyle(() => ({ opacity: 0.82 + scale.value * 0.18, transform: [{ scale: scale.value }] })); useEffect(() => { scale.value = reducedMotion ? (value ? 1 : 0.96) : withTiming(value ? 1 : 0.96, { duration: 180 }); }, [reducedMotion, scale, value]); return <Animated.View style={[styles.settingRow, { borderTopColor: colors.outline }, animatedStyle]}>{children}</Animated.View>; }
function DataAction({ icon, title, description, tone, busy, disabled, onPress, colors }: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string; tone: "safe" | "danger"; busy: boolean; disabled: boolean; onPress: () => void; colors: Colors }) { const accent = tone === "danger" ? colors.error : colors.primary; return <Pressable accessibilityRole="button" accessibilityLabel={title} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.dataAction, { borderColor: tone === "danger" ? `${colors.error}55` : colors.outline, opacity: disabled && !busy ? 0.5 : pressed ? 0.72 : 1 }]}><View style={[styles.dataIcon, { backgroundColor: tone === "danger" ? `${colors.error}18` : colors.primarySoft }]}>{busy ? <ActivityIndicator color={accent} /> : <Ionicons color={accent} name={icon} size={23} />}</View><View style={styles.dataCopy}><Text style={[styles.dataTitle, { color: tone === "danger" ? colors.error : colors.text }]}>{title}</Text><Text style={[styles.dataDescription, { color: colors.textSecondary }]}>{description}</Text></View><Ionicons color={accent} name="chevron-forward" size={20} /></Pressable>; }
const styles = StyleSheet.create({ heading: { fontSize: 21, fontWeight: "900" }, subtitle: { fontSize: 14, lineHeight: 20 }, sectionHeading: { alignItems: "center", flexDirection: "row", gap: spacing.sm }, sectionIcon: { alignItems: "center", borderRadius: radii.pill, height: 44, justifyContent: "center", width: 44 }, copy: { flex: 1, gap: spacing.xs }, themeGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, themeOption: { alignItems: "center", borderRadius: radii.input, borderWidth: 1, flexDirection: "row", gap: spacing.xs, minHeight: 48, paddingHorizontal: spacing.sm }, themeLabel: { fontSize: 14, fontWeight: "800" }, settingRow: { alignItems: "center", borderTopWidth: 1, flexDirection: "row", gap: spacing.sm, minHeight: 78, paddingTop: spacing.md }, settingIcon: { alignItems: "center", backgroundColor: "transparent", width: 30 }, settingCopy: { flex: 1, gap: 3 }, settingTitle: { fontSize: 16, fontWeight: "800" }, settingSubtitle: { fontSize: 13, lineHeight: 18 }, warningText: { fontSize: 13, fontWeight: "800", lineHeight: 18 }, dataAction: { alignItems: "center", borderRadius: radii.input, borderWidth: 1, flexDirection: "row", gap: spacing.sm, minHeight: 76, padding: spacing.sm }, dataIcon: { alignItems: "center", borderRadius: radii.pill, height: 42, justifyContent: "center", width: 42 }, dataCopy: { flex: 1, gap: 3 }, dataTitle: { fontSize: 16, fontWeight: "900" }, dataDescription: { fontSize: 13, lineHeight: 18 }, detailsToggle: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", minHeight: 48, paddingHorizontal: spacing.xs }, detailsPanel: { alignItems: "flex-start", borderRadius: radii.input, flexDirection: "row", gap: spacing.sm, padding: spacing.md }, detailsText: { flex: 1, fontSize: 13, lineHeight: 19 } });
