import { Screen } from "@/src/shared/ui/Screen";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";

export default function NowScreen() {
  return (
    <Screen>
      <PageHero title="¿Qué sigue?" subtitle="Un paso a la vez, en lo que importa." />
      <EmptyState message="Todavía no elegiste en qué enfocarte. Explora tus siguientes acciones." />
    </Screen>
  );
}
