import { Screen } from "@/src/shared/ui/Screen";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";

export default function InboxScreen() {
  return (
    <Screen>
      <PageHero title="Bandeja" subtitle="Tus capturas estarán aquí para aclararlas cuando quieras." />
      <EmptyState message="Todo lo que capturaste ya tiene un lugar. Puedes anotar algo nuevo cuando quieras." />
    </Screen>
  );
}
