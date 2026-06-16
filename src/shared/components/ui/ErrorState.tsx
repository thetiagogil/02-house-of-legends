import { EmptyState } from "./EmptyState";

type ErrorStateProps = {
  title: string;
  message: string;
};

export const ErrorState = ({ title, message }: ErrorStateProps) => {
  return <EmptyState title={title} message={message} />;
};
