import { useEffect, useId, type MouseEvent } from "react";
import { Icon } from "../../../shared/components/ui/Icon";

type BuildDeleteDialogProps = {
  buildTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export const BuildDeleteDialog = ({
  buildTitle,
  onCancel,
  onConfirm,
}: BuildDeleteDialogProps) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  const stopDialogClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="confirmation-dialog-backdrop" onClick={onCancel}>
      <section
        className="confirmation-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={stopDialogClick}
      >
        <div className="confirmation-dialog__header">
          <div>
            <h2 id={titleId}>Delete {buildTitle}?</h2>
          </div>

          <button
            type="button"
            className="build-row__icon-action"
            onClick={onCancel}
            aria-label="Close delete confirmation"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        <p id={descriptionId} className="confirmation-dialog__description">
          This build will be removed from your saved builds. This action cannot
          be undone.
        </p>

        <div className="confirmation-dialog__actions">
          <button
            type="button"
            className="muted-action"
            onClick={onCancel}
            autoFocus
          >
            Cancel
          </button>
          <button
            type="button"
            className="primary-action danger-confirm-action"
            onClick={onConfirm}
          >
            Delete build
          </button>
        </div>
      </section>
    </div>
  );
};
