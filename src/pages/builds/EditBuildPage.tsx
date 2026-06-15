import { Link, useNavigate, useParams } from "react-router-dom";
import { BuildForm } from "../../features/builds/components/BuildForm";
import { useBuildForm } from "../../features/builds/hooks/useBuildForm";
import { EMPTY_BUILD_SLOTS } from "../../features/builds/lib/build-form-options";
import { readBuild } from "../../features/builds/storage/build-storage";
import { Icon } from "../../shared/components/ui/Icon";
import { LoadingState } from "../../shared/components/ui/LoadingState";

export function EditBuildPage() {
  const navigate = useNavigate();
  const { buildId } = useParams();
  const build = buildId ? readBuild(buildId) : null;
  const form = useBuildForm({
    initialBuild: build ?? undefined,
    onBuildSaved: () => navigate("/builds"),
  });

  if (!build) {
    return (
      <div className="page-container page-container--form">
        <div className="empty-state">
          <h2>Build not found.</h2>
          <p>This build may have been deleted or moved.</p>
          <Link to="/builds" className="muted-action">
            <Icon name="chevron-left" size={16} />
            Back to builds
          </Link>
        </div>
      </div>
    );
  }

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
        <h1>Edit Build</h1>
        <p>
          {form.completedSlots} of {EMPTY_BUILD_SLOTS.length} slots ready
        </p>
      </header>

      <BuildForm form={form} cancelPath="/builds" submitLabel="Save Build" />
    </div>
  );
}
