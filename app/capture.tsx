import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";

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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>¿Qué tienes en mente?</Text>
        <TextInput
          accessibilityLabel="Texto de captura"
          autoFocus
          multiline
          onChangeText={setText}
          placeholder="Escribe una idea, pendiente o compromiso"
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.outline, color: colors.text }]}
          value={text}
        />
        {error ? <Text accessibilityRole="alert" style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
        <Pressable accessibilityRole="button" accessibilityLabel="Guardar en bandeja" disabled={saving} onPress={() => void saveCapture()} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? colors.primaryPressed : colors.primary, opacity: saving ? 0.7 : 1 }]}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Guardar en bandeja</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, gap: spacing.lg, padding: spacing.lg, paddingTop: spacing.xl },
  title: { fontSize: 32, fontWeight: "800" },
  input: { borderRadius: radii.input, borderWidth: 1, flex: 1, fontSize: 18, padding: spacing.md, textAlignVertical: "top" },
  error: { fontSize: 15, lineHeight: 21 },
  button: { alignItems: "center", borderRadius: radii.pill, justifyContent: "center", minHeight: 56, padding: spacing.md },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" }
});
