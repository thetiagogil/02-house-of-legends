import { Link } from "react-router-dom";
import { EmptyState } from "../../../shared/components/ui/EmptyState";

export const BuildsEmptyState = () => {
  return (
    <EmptyState
      title="No builds forged yet."
      size="large"
      action={
        <Link to="/builds/new" className="primary-action">
          Forge your first build
        </Link>
      }
    />
  );
};
