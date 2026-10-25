import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { LinearTransition, ReduceMotion, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { Motion } from "@/src/shared/ui/Motion";
import { BackButton, navigateBack } from "@/src/shared/ui/BackButton";
import { captureExitDecision } from "@/src/shared/ui/captureExitPolicy";

const SAVE_ERROR = "No se pudo guardar. Intenta otra vez; mantendremos tu texto en pantalla.";
type CaptureStatus = "idle" | "saving" | "success";

export default function CaptureScreen() {
  const colors = useAppTheme();
  const repository = useItemRepository();
  const reducedMotion = useReducedMotion();
  const [text, setText] = useState("");
  const [status, setStatus] = useState<CaptureStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [inputHeight, setInputHeight] = useState(156);
  const exitPromptOpen = useRef(false);
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  function exitCapture() {
    const decision = captureExitDecision(text, status);
    if (decision === "blocked") return;
    if (decision === "allow") {
      navigateBack("/(tabs)/index");
      return;
    }
    if (exitPromptOpen.current) return;
    exitPromptOpen.current = true;
    Alert.alert("Descartar captura", "Hay texto sin guardar. ¿Querés salir sin guardarlo?", [
      { text: "Seguir editando", style: "cancel", onPress: () => { exitPromptOpen.current = false; } },
      { text: "Descartar captura", style: "destructive", onPress: () => { exitPromptOpen.current = false; navigateBack("/(tabs)/index"); } },
    ]);
  }

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      exitCapture();
      return true;
    });
    return () => subscription.remove();
  }, [status, text]);

  useEffect(() => {
    if (status !== "success") return undefined;
    const timeout = setTimeout(() => router.back(), reducedMotion ? 250 : 650);
    return () => clearTimeout(timeout);
  }, [reducedMotion, status]);

  useEffect(() => {
    if (!error || reducedMotion) return;
    shake.value = withSequence(withTiming(-5, { duration: 45 }), withTiming(5, { duration: 45 }), withTiming(-3, { duration: 35 }), withTiming(0, { duration: 35 }));
  }, [error, reducedMotion, shake]);

  async function saveCapture() {
    if (status === "saving" || status === "success") return;
    setError(null);
    if (!text.trim()) {
      setError("Escribe algo para guardarlo en tu bandeja.");
      return;
    }
    setStatus("saving");
    try {
      await repository.createInboxItem(text);
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error && cause.message === "La captura no puede estar vacía." ? cause.message : SAVE_ERROR);
      setStatus("idle");
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <Motion variant="capture"><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <BackButton fallback="/(tabs)/index" label="Cerrar captura" variant="close" onPress={exitCapture} />
        <Text style={[styles.title, { color: colors.text }]}>¿Qué tienes en mente?</Text>
        <Text style={{ color: colors.textSecondary }}>Anotá primero. Las decisiones vienen después.</Text>
        <Animated.View layout={reducedMotion ? undefined : LinearTransition.duration(220).reduceMotion(ReduceMotion.System)} style={[styles.composer, { backgroundColor: colors.surface, borderColor: error ? colors.error : colors.outline }, shakeStyle]}>
          <TextInput accessibilityLabel="Texto de captura" multiline onChangeText={(value) => { setText(value); if (error) setError(null); }} onContentSizeChange={(event) => setInputHeight(Math.min(260, Math.max(156, event.nativeEvent.contentSize.height + spacing.md * 2)))} placeholder="Escribe una idea, pendiente o compromiso" placeholderTextColor={colors.textSecondary} style={[styles.input, { color: colors.text, height: inputHeight }]} value={text} />
          <View style={styles.composerFooter}>
            <Text style={[styles.hint, { color: colors.textSecondary }]}>Se guardará directamente en Bandeja.</Text>
            <Pressable accessibilityLabel={status === "success" ? "Captura guardada" : "Guardar en bandeja"} accessibilityRole="button" accessibilityState={{ busy: status === "saving", disabled: status !== "idle" }} disabled={status !== "idle"} onPress={() => void saveCapture()} style={({ pressed }) => [styles.saveButton, { backgroundColor: status === "success" ? colors.success : pressed ? colors.primaryPressed : colors.primary, opacity: status === "saving" ? 0.8 : 1 }]}>
              {status === "saving" ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Ionicons color="#FFFFFF" name={status === "success" ? "checkmark" : "arrow-up"} size={20} />}
              <Text style={styles.saveLabel}>{status === "saving" ? "Guardando..." : status === "success" ? "Guardado" : "Guardar"}</Text>
            </Pressable>
          </View>
        </Animated.View>
        <View style={[styles.help, { backgroundColor: colors.surfaceSoft }]}><Ionicons color={colors.primary} name="sparkles-outline" size={24} /><View style={styles.helpCopy}><Text style={[styles.helpTitle, { color: colors.text }]}>Después lo aclaramos</Text><Text style={{ color: colors.textSecondary }}>Guardá la idea sin decidir nada ahora. Clarunio la deja en tu bandeja.</Text></View></View>
        {error ? <Animated.View style={shakeStyle}><Text accessibilityRole="alert" style={[styles.error, { color: colors.error }]}>{error}</Text></Animated.View> : null}
        </ScrollView></Motion>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, gap: spacing.lg, padding: spacing.lg, paddingTop: spacing.md },
  close: { alignSelf: "flex-end", minHeight: 48, justifyContent: "center", padding: spacing.xs },
  title: { fontSize: 32, fontWeight: "800" },
  composer: { borderRadius: radii.panel, borderWidth: 1, elevation: 2, gap: spacing.sm, padding: spacing.md, shadowColor: "#2C1A63", shadowOpacity: 0.08, shadowRadius: 12 },
  input: { fontSize: 20, lineHeight: 28, padding: 0, textAlignVertical: "top" },
  composerFooter: { alignItems: "center", flexDirection: "row", gap: spacing.sm, justifyContent: "space-between" },
  hint: { flex: 1, fontSize: 13, lineHeight: 18 },
  saveButton: { alignItems: "center", borderRadius: radii.pill, flexDirection: "row", gap: spacing.xs, justifyContent: "center", minHeight: 48, paddingHorizontal: spacing.md },
  saveLabel: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  help: { alignItems: "flex-start", borderRadius: radii.card, flexDirection: "row", gap: spacing.sm, padding: spacing.md }, helpCopy: { flex: 1, gap: spacing.xs }, helpTitle: { fontSize: 16, fontWeight: "800" },
  error: { fontSize: 15, lineHeight: 21 },
});
