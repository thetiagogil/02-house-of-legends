import { useNavigate } from "react-router-dom";
import { BuildForm } from "../../features/builds/components/BuildForm";
import { useBuildForm } from "../../features/builds/hooks/useBuildForm";
import { EMPTY_BUILD_SLOTS } from "../../features/builds/lib/build-form-options";
import { EmptyState } from "../../shared/components/ui/EmptyState";
import { LoadingState } from "../../shared/components/ui/LoadingState";

export function NewBuildPage() {
  const navigate = useNavigate();
  const form = useBuildForm({
    onBuildSaved: () => navigate("/builds"),
  });

  if (form.isLoading) {
    return <LoadingState label="Preparing the forge..." />;
  }

  if (form.error) {
    return (
      <div className="page-container page-container--form">
        <EmptyState title="The forge is unavailable." message={form.error} />
      </div>
    );
  }

  return (
    <div className="page-container page-container--form">
      <header className="page-header">
        <h1>Forge a Build</h1>
        <p>
          {form.completedSlots} of {EMPTY_BUILD_SLOTS.length} slots ready
        </p>
      </header>

      <BuildForm form={form} cancelPath="/builds" />
    </div>
  );
}
