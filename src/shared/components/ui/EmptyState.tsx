import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message?: string;
  action?: ReactNode;
  size?: "default" | "large";
};

export function EmptyState({
  title,
  message,
  action,
  size = "default",
}: EmptyStateProps) {
  return (
    <div
      className={
        size === "large" ? "empty-state empty-state--large" : "empty-state"
      }
    >
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
