import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import { useProjectRepository } from "@/src/features/projects/data/useProjectRepository";
import type { InboxDecision, Item } from "@/src/features/items/domain/item";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { ActionButton } from "@/src/shared/ui/ActionButton";
import { ChoiceCard } from "@/src/shared/ui/ChoiceCard";
import { Motion } from "@/src/shared/ui/Motion";

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
  if (status === "error" && !item) return <Centered colors={colors}><Text accessibilityRole="alert" style={[styles.error, { color: colors.error }]}>{error}</Text><Button label="Reintentar" onPress={() => void loadItem()} /></Centered>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
       <Motion><View style={styles.content}>
         <View style={styles.top}><Pressable accessibilityLabel="Cerrar aclaración" accessibilityRole="button" onPress={() => router.back()}><Ionicons color={colors.textSecondary} name="close" size={26} /></Pressable></View>
         <Text style={[styles.kicker, { color: colors.textSecondary }]}>Aclarar entrada</Text>
         <Text style={{ color: colors.textSecondary }}>Paso {step === "question" ? 1 : step === "destination" ? 2 : 3} de 3</Text>
         <Text style={[styles.title, { color: colors.text }]}>{step === "next" || step === "project" ? "¿Cuál es el siguiente paso concreto?" : step === "waiting" ? "¿Qué respuesta o resultado estás esperando?" : step === "destination" ? "¿Dónde quieres guardarlo?" : "¿Esto requiere alguna acción?"}</Text>
        <Text style={[styles.itemTitle, { color: colors.textSecondary }]}>{item?.title}</Text>
        {step === "question" ? <>
            <ChoiceCard icon="checkmark-circle-outline" label="Siguiente acción" description="Un paso concreto que podés hacer." onPress={() => { setDecision({ destination: "NEXT", title: nextTitle }); setStep("next"); }} />
            <ChoiceCard icon="layers-outline" label="Proyecto" description="Un resultado que requiere varios pasos." onPress={() => { setDecision({ destination: "PROJECT", desiredOutcome: "", firstAction: nextTitle }); setStep("project"); }} />
            <ChoiceCard icon="time-outline" label="Estoy esperando" description="Depende de una respuesta o tercero." onPress={() => { setDecision({ destination: "WAITING", waitingFor: "" }); setStep("waiting"); }} />
           <ChoiceCard icon="help-circle-outline" label="No requiere acción" description="Guardalo como referencia, algún día o descartalo." onPress={() => setStep("destination")} />
        </> : null}
        {step === "destination" ? <>
           <ChoiceCard icon="book-outline" label="Guardar como referencia" description="Información útil para consultar." onPress={() => setDecision({ destination: "REFERENCE" })} selected={decision?.destination === "REFERENCE"} />
           <ChoiceCard icon="moon-outline" label="Dejar para algún día" description="Una posibilidad sin compromiso actual." onPress={() => setDecision({ destination: "SOMEDAY" })} selected={decision?.destination === "SOMEDAY"} />
           <ChoiceCard icon="trash-outline" label="Descartar" description="No necesitás conservarlo." onPress={() => setDecision({ destination: "TRASH" })} selected={decision?.destination === "TRASH"} />
        </> : null}
         {step === "project" ? <TextInput accessibilityLabel="Resultado deseado del proyecto" placeholder="Resultado deseado" onChangeText={setDesiredOutcome} value={desiredOutcome} style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.outline, color: colors.text }]} /> : null}
         {step === "next" || step === "project" ? <TextInput accessibilityLabel="Siguiente paso concreto" autoFocus={step === "next"} onChangeText={setNextTitle} value={nextTitle} placeholder="Primera acción concreta" style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.outline, color: colors.text }]} /> : null}
         {step === "waiting" ? <TextInput accessibilityLabel="Respuesta o persona esperada" autoFocus onChangeText={setWaitingFor} value={waitingFor} placeholder="Persona o respuesta esperada" style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.outline, color: colors.text }]} /> : null}
         {error ? <><Text accessibilityRole="alert" style={[styles.error, { color: colors.error }]}>{error}</Text><Button label="Reintentar" onPress={() => void loadItem()} /></> : null}
          {step !== "question" ? <Button disabled={status === "saving" || !decision || (step === "waiting" && !waitingFor.trim()) || (step === "project" && (!desiredOutcome.trim() || !nextTitle.trim()))} label={status === "saving" ? "Guardando..." : "Confirmar organización"} onPress={() => void confirm()} /> : null}
         <Pressable accessibilityRole="button" accessibilityLabel="Cancelar aclaración" onPress={() => router.back()}><Text style={[styles.cancel, { color: colors.textSecondary }]}>Cancelar</Text></Pressable>
       </View></Motion>
    </View>
  );
}

function Button({ disabled = false, label, onPress }: { disabled?: boolean; label: string; onPress: () => void }) {
  return <ActionButton disabled={disabled} onPress={onPress}>{label}</ActionButton>;
}

function Centered({ children, colors }: { children: ReactNode; colors: ReturnType<typeof useAppTheme> }) { return <View style={[styles.centered, { backgroundColor: colors.background }]}>{children}</View>; }

const styles = StyleSheet.create({
  container: { flex: 1 }, content: { flex: 1, gap: spacing.md, padding: spacing.lg, paddingTop: spacing.md }, top: { alignItems: "flex-end", minHeight: 48 }, centered: { alignItems: "center", flex: 1, gap: spacing.lg, justifyContent: "center", padding: spacing.lg }, kicker: { fontSize: 15, fontWeight: "700" }, title: { fontSize: 30, fontWeight: "800", lineHeight: 38 }, itemTitle: { fontSize: 17, lineHeight: 24 }, input: { borderRadius: radii.input, borderWidth: 1, fontSize: 18, minHeight: 120, padding: spacing.md, textAlignVertical: "top" }, error: { fontSize: 15, lineHeight: 21 }, cancel: { alignSelf: "center", fontSize: 16, padding: spacing.md }
});
