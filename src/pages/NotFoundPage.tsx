import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="not-found">
      <div>
        <h1>404</h1>
        <p>This realm does not exist.</p>
        <Link to="/" className="primary-action">
          Return Home
        </Link>
      </div>
    </div>
  );
}
