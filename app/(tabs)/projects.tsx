import { Screen } from "@/src/shared/ui/Screen";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";

export default function ProjectsScreen() {
  return (
    <Screen>
      <PageHero title="Proyectos" subtitle="Resultados que requieren más de un paso." />
      <EmptyState message="Aún no tienes proyectos. Cuando aparezca uno, podrás ver aquí su resultado deseado y siguiente paso." />
    </Screen>
  );
}
