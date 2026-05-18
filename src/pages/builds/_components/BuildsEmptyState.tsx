import { Link } from "react-router-dom";

export function BuildsEmptyState() {
  return (
    <div className="empty-state empty-state--large">
      <h2>No builds forged yet.</h2>
      <Link to="/builds/new" className="primary-action">
        Forge your first build
      </Link>
    </div>
  );
}
