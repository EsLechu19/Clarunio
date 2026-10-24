import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { ActionButton } from "@/src/shared/ui/ActionButton";
import { Card } from "@/src/shared/ui/Card";
import { Motion } from "@/src/shared/ui/Motion";

const SAVE_ERROR = "No se pudo guardar. Intenta otra vez; mantendremos tu texto en pantalla.";

export default function CaptureScreen() {
  const colors = useAppTheme();
  const repository = useItemRepository();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveCapture() {
    if (saving) return;
    setError(null);
    if (!text.trim()) {
      setError("Escribe algo para guardarlo en tu bandeja.");
      return;
    }
    setSaving(true);
    try {
      await repository.createInboxItem(text);
      router.back();
    } catch (cause) {
      setError(cause instanceof Error && cause.message === "La captura no puede estar vacía." ? cause.message : SAVE_ERROR);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <Motion><View style={styles.content}>
        <Pressable accessibilityLabel="Cerrar captura" accessibilityRole="button" onPress={() => router.back()} style={styles.close}><Ionicons color={colors.textSecondary} name="close" size={26} /></Pressable>
        <Text style={[styles.title, { color: colors.text }]}>¿Qué tienes en mente?</Text>
        <Text style={{ color: colors.textSecondary }}>Anotá primero. Las decisiones vienen después.</Text>
        <Card><TextInput
          accessibilityLabel="Texto de captura"
          autoFocus
          multiline
          onChangeText={setText}
          placeholder="Escribe una idea, pendiente o compromiso"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.outline, color: colors.text }]}
          value={text}
        /></Card>
        {error ? <Text accessibilityRole="alert" style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
        <ActionButton icon="file-tray-outline" disabled={saving} onPress={() => void saveCapture()}>{saving ? "Guardando..." : "Guardar en bandeja"}</ActionButton>
        </View></Motion>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, gap: spacing.lg, padding: spacing.lg, paddingTop: spacing.md },
  close: { alignSelf: "flex-end", minHeight: 48, justifyContent: "center", padding: spacing.xs },
  title: { fontSize: 32, fontWeight: "800" },
  input: { borderRadius: radii.input, borderWidth: 1, flex: 1, fontSize: 18, padding: spacing.md, textAlignVertical: "top" },
  error: { fontSize: 15, lineHeight: 21 },
});
