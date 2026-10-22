import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import { useProjectRepository } from "@/src/features/projects/data/useProjectRepository";
import type { InboxDecision, Item } from "@/src/features/items/domain/item";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";

type Step = "question" | "destination" | "next" | "project" | "waiting";
type Status = "loading" | "ready" | "saving" | "success" | "error";

export default function ClarifyScreen() {
  const colors = useAppTheme();
  const repository = useItemRepository();
  const projectRepository = useProjectRepository();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [step, setStep] = useState<Step>("question");
  const [decision, setDecision] = useState<InboxDecision | null>(null);
  const [nextTitle, setNextTitle] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [waitingFor, setWaitingFor] = useState("");
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const loadItem = useCallback(async () => {
    if (!id) {
      setError("No se indicó qué entrada aclarar.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const loaded = await repository.getItemById(id);
      if (!loaded || loaded.state !== "INBOX") throw new Error("Esta entrada ya no está en la bandeja.");
      setItem(loaded);
      setNextTitle(loaded.title);
      setStatus("ready");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cargar la entrada.");
      setStatus("error");
    }
  }, [id, repository]);

  useEffect(() => { void loadItem(); }, [loadItem]);

  async function confirm() {
    if (status === "saving" || !item || !decision) return;
    if (decision.destination === "NEXT" && !nextTitle.trim()) {
      setError("Escribe el siguiente paso concreto.");
      setStatus("ready");
      return;
    }
    const confirmedDecision = decision.destination === "WAITING"
      ? { destination: "WAITING" as const, waitingFor }
      : decision.destination === "PROJECT"
        ? { destination: "PROJECT" as const, desiredOutcome, firstAction: nextTitle }
        : decision.destination === "NEXT"
          ? { destination: "NEXT" as const, title: nextTitle }
          : decision;
    setStatus("saving");
    setError(null);
    try {
      if (confirmedDecision.destination === "PROJECT") {
        await projectRepository.clarifyInboxItemAsProject(item.id, desiredOutcome, nextTitle);
      } else {
        await repository.clarifyInboxItem(item.id, confirmedDecision);
      }
      setStatus("success");
      setTimeout(() => router.replace("/(tabs)/inbox"), 350);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar la decisión. Intenta otra vez.");
      setStatus("error");
    }
  }

  if (status === "loading") return <Centered colors={colors}><ActivityIndicator accessibilityLabel="Cargando entrada" color={colors.primary} /></Centered>;
  if (status === "success") return <Centered colors={colors}><Text style={[styles.title, { color: colors.text }]}>Entrada aclarada.</Text></Centered>;
  if (status === "error" && !item) return <Centered colors={colors}><Text accessibilityRole="alert" style={[styles.error, { color: colors.error }]}>{error}</Text><Button colors={colors} label="Reintentar" onPress={() => void loadItem()} /></Centered>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.kicker, { color: colors.textSecondary }]}>Aclarar entrada</Text>
         <Text style={[styles.title, { color: colors.text }]}>{step === "next" || step === "project" ? "¿Cuál es el siguiente paso concreto?" : step === "waiting" ? "¿Qué respuesta o resultado estás esperando?" : step === "destination" ? "¿Dónde quieres guardarlo?" : "¿Esto requiere alguna acción?"}</Text>
        <Text style={[styles.itemTitle, { color: colors.textSecondary }]}>{item?.title}</Text>
        {step === "question" ? <>
           <Choice colors={colors} label="Sí, requiere una acción" onPress={() => { setDecision({ destination: "NEXT", title: nextTitle }); setStep("next"); }} />
           <Choice colors={colors} label="Sí, es un proyecto de varios pasos" onPress={() => { setDecision({ destination: "PROJECT", desiredOutcome: "", firstAction: nextTitle }); setStep("project"); }} />
           <Choice colors={colors} label="Estoy esperando una respuesta" onPress={() => { setDecision({ destination: "WAITING", waitingFor: "" }); setStep("waiting"); }} />
          <Choice colors={colors} label="No, no requiere una acción" onPress={() => setStep("destination")} />
        </> : null}
        {step === "destination" ? <>
          <Choice colors={colors} label="Guardar como referencia" onPress={() => setDecision({ destination: "REFERENCE" })} selected={decision?.destination === "REFERENCE"} />
          <Choice colors={colors} label="Dejar para algún día" onPress={() => setDecision({ destination: "SOMEDAY" })} selected={decision?.destination === "SOMEDAY"} />
          <Choice colors={colors} label="Descartar" onPress={() => setDecision({ destination: "TRASH" })} selected={decision?.destination === "TRASH"} />
        </> : null}
         {step === "project" ? <TextInput accessibilityLabel="Resultado deseado del proyecto" placeholder="Resultado deseado" onChangeText={setDesiredOutcome} value={desiredOutcome} style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.outline, color: colors.text }]} /> : null}
         {step === "next" || step === "project" ? <TextInput accessibilityLabel="Siguiente paso concreto" autoFocus={step === "next"} onChangeText={setNextTitle} value={nextTitle} placeholder="Primera acción concreta" style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.outline, color: colors.text }]} /> : null}
         {step === "waiting" ? <TextInput accessibilityLabel="Respuesta o persona esperada" autoFocus onChangeText={setWaitingFor} value={waitingFor} placeholder="Persona o respuesta esperada" style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.outline, color: colors.text }]} /> : null}
        {error ? <><Text accessibilityRole="alert" style={[styles.error, { color: colors.error }]}>{error}</Text><Button colors={colors} label="Reintentar" onPress={() => void loadItem()} /></> : null}
         {step !== "question" ? <Button colors={colors} disabled={status === "saving" || !decision || (step === "waiting" && !waitingFor.trim()) || (step === "project" && (!desiredOutcome.trim() || !nextTitle.trim()))} label={status === "saving" ? "Guardando..." : "Confirmar organización"} onPress={() => void confirm()} /> : null}
        <Pressable accessibilityRole="button" accessibilityLabel="Cancelar aclaración" onPress={() => router.back()}><Text style={[styles.cancel, { color: colors.textSecondary }]}>Cancelar</Text></Pressable>
      </View>
    </View>
  );
}

function Choice({ colors, label, onPress, selected = false }: { colors: ReturnType<typeof useAppTheme>; label: string; onPress: () => void; selected?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.choice, { backgroundColor: selected ? colors.primarySoft : colors.surface, borderColor: selected ? colors.primary : colors.outline }]}><Text style={[styles.choiceText, { color: colors.text }]}>{label}</Text></Pressable>;
}

function Button({ colors, disabled = false, label, onPress }: { colors: ReturnType<typeof useAppTheme>; disabled?: boolean; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.button, { backgroundColor: colors.primary, opacity: disabled ? 0.5 : 1 }]}><Text style={styles.buttonText}>{label}</Text></Pressable>;
}

function Centered({ children, colors }: { children: ReactNode; colors: ReturnType<typeof useAppTheme> }) { return <View style={[styles.centered, { backgroundColor: colors.background }]}>{children}</View>; }

const styles = StyleSheet.create({
  container: { flex: 1 }, content: { flex: 1, gap: spacing.md, padding: spacing.lg, paddingTop: spacing.xl }, centered: { alignItems: "center", flex: 1, gap: spacing.lg, justifyContent: "center", padding: spacing.lg }, kicker: { fontSize: 15, fontWeight: "700" }, title: { fontSize: 30, fontWeight: "800", lineHeight: 38 }, itemTitle: { fontSize: 17, lineHeight: 24 }, choice: { borderRadius: radii.card, borderWidth: 1, minHeight: 60, justifyContent: "center", padding: spacing.md }, choiceText: { fontSize: 16, fontWeight: "700" }, input: { borderRadius: radii.input, borderWidth: 1, fontSize: 18, minHeight: 120, padding: spacing.md, textAlignVertical: "top" }, error: { fontSize: 15, lineHeight: 21 }, button: { alignItems: "center", borderRadius: radii.pill, justifyContent: "center", minHeight: 56, padding: spacing.md }, buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" }, cancel: { alignSelf: "center", fontSize: 16, padding: spacing.md }
});
