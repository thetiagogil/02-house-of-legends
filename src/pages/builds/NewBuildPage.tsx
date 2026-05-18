import { useNavigate } from "react-router-dom";
import { BuildForm } from "../../features/builds/components/BuildForm";
import { useBuildForm } from "../../features/builds/hooks/useBuildForm";
import { EMPTY_BUILD_SLOTS } from "../../features/builds/lib/build-form-options";
import { LoadingState } from "../../shared/components/ui/LoadingState";

export function NewBuildPage() {
  const navigate = useNavigate();
  const form = useBuildForm({
    onBuildCreated: () => navigate("/builds"),
  });

  if (form.isLoading) {
    return <LoadingState label="Preparing the forge..." />;
  }

  if (form.error) {
    return (
      <div className="page-container page-container--form">
        <div className="empty-state">
          <h2>The forge is unavailable.</h2>
          <p>{form.error}</p>
        </div>
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
