import { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { useBackupRepository } from "@/src/features/backup/data/useBackupRepository";
import { previewBackup, validateBackup } from "@/src/features/backup/domain/backup";
import { enableNotifications } from "@/src/features/notifications/data/notificationService";
import { useThemePreferences } from "@/src/shared/theme/ThemeProvider";
import { THEME_MODES, type ThemePreference } from "@/src/features/settings/domain/settings";
import { PageHero } from "@/src/shared/ui/PageHero";
import { Screen } from "@/src/shared/ui/Screen";
import { radii, spacing } from "@/src/shared/theme/tokens";

export default function SettingsScreen() {
  const { colors, settings, updateSettings } = useThemePreferences();
  const backupRepository = useBackupRepository();
  const [message, setMessage] = useState<string | null>(null);
  async function exportData() { try { const backup = await backupRepository.exportBackup(); const uri = `${FileSystem.cacheDirectory}clarunio-backup-${Date.now()}.json`; await FileSystem.writeAsStringAsync(uri, JSON.stringify(backup, null, 2)); await Sharing.shareAsync(uri, { mimeType: "application/json", dialogTitle: "Compartir respaldo de Clarunio" }); setMessage("Respaldo preparado."); } catch (cause) { setMessage(cause instanceof Error ? cause.message : "No se pudo exportar."); } }
  async function importData() { try { const result = await DocumentPicker.getDocumentAsync({ type: "application/json", copyToCacheDirectory: true, multiple: false }); if (result.canceled || !result.assets?.[0]) return; const json = await FileSystem.readAsStringAsync(result.assets[0].uri); const backup = validateBackup(JSON.parse(json)); const counts = previewBackup(backup); Alert.alert("Reemplazar datos", `Se importarán ${counts.items} elementos y ${counts.projects} proyectos. Se reemplazarán los datos actuales.`, [{ text: "Cancelar", style: "cancel" }, { text: "Reemplazar", style: "destructive", onPress: () => { void backupRepository.replaceFromJson(json).then(() => setMessage("Importación completada.")).catch((cause) => setMessage(cause instanceof Error ? cause.message : "No se pudo importar.")); } }]); } catch (cause) { setMessage(cause instanceof Error ? cause.message : "El respaldo no es válido."); } }
  async function toggleNotifications(value: boolean) { if (!value) { await updateSettings({ notificationsEnabled: false }); return; } const granted = await enableNotifications(); await updateSettings({ notificationsEnabled: granted }); setMessage(granted ? "Recordatorios activados." : "Permiso de notificaciones denegado; la app sigue funcionando."); }
  return <Screen><PageHero title="Ajustes" subtitle="Configura Clarunio sin salir del dispositivo." />
     <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}><Text style={[styles.heading, { color: colors.text }]}>Apariencia</Text><View style={styles.row}><Text style={{ color: colors.text }}>Tema</Text><View style={styles.options}>{THEME_MODES.map((mode) => <Pressable key={mode} accessibilityRole="radio" accessibilityState={{ selected: settings.theme === mode }} accessibilityLabel={`Tema ${mode === "system" ? "sistema" : mode === "light" ? "claro" : "oscuro"}`} onPress={() => void updateSettings({ theme: mode as ThemePreference })} style={[styles.option, { backgroundColor: settings.theme === mode ? colors.primarySoft : colors.surfaceSoft }]}><Text style={{ color: colors.text }}>{mode === "system" ? "Sistema" : mode === "light" ? "Claro" : "Oscuro"}</Text></Pressable>)}</View></View><SettingRow colors={colors} label="Ayudas contextuales" value={settings.contextualHelp} onValueChange={(value) => void updateSettings({ contextualHelp: value })} /><SettingRow colors={colors} label="Avisos de revisión" value={settings.weeklyReviewReminders} onValueChange={(value) => void updateSettings({ weeklyReviewReminders: value })} /><SettingRow colors={colors} label="Recordatorios locales" value={settings.notificationsEnabled} onValueChange={(value) => void toggleNotifications(value)} /></View>
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}><Text style={[styles.heading, { color: colors.text }]}>Datos</Text><Pressable accessibilityRole="button" onPress={() => void exportData()}><Text style={{ color: colors.primary }}>Exportar respaldo JSON</Text></Pressable><Pressable accessibilityRole="button" onPress={() => void importData()}><Text style={{ color: colors.primary }}>Importar y reemplazar datos</Text></Pressable></View>
    {message ? <Text accessibilityRole="alert" style={{ color: colors.textSecondary }}>{message}</Text> : null}
  </Screen>;
}
function SettingRow({ colors, label, value, onValueChange }: { colors: ReturnType<typeof useThemePreferences>["colors"]; label: string; value: boolean; onValueChange: (value: boolean) => void }) { return <View style={styles.row}><Text style={{ color: colors.text }}>{label}</Text><Switch accessibilityLabel={label} accessibilityRole="switch" accessibilityState={{ checked: value }} value={value} onValueChange={onValueChange} /></View>; }
const styles = StyleSheet.create({ card: { borderRadius: radii.card, borderWidth: 1, gap: spacing.md, padding: spacing.md }, heading: { fontSize: 20, fontWeight: "800" }, row: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: spacing.sm }, options: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }, option: { borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs } });
