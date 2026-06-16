import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../../shared/components/ui/Icon";
import type { BuildFormState } from "../hooks/useBuildForm";
import { BuildCorePanel } from "./BuildCorePanel";
import { BuildLoadoutPanel } from "./BuildLoadoutPanel";
import { BuildPickerPanel } from "./BuildPickerPanel";

type BuildFormProps = {
  form: BuildFormState;
  cancelPath: string;
  submitLabel?: string;
};

export const BuildForm = ({
  form,
  cancelPath,
  submitLabel = "Create Build",
}: BuildFormProps) => {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    form.submitBuild();
  }

  return (
    <form onSubmit={handleSubmit} className="build-create-form">
      <section className="build-forge build-forge--picker">
        <div className="build-form">
          <BuildCorePanel
            pickerTarget={form.pickerTarget}
            selectedChampion={form.selectedChampion}
            setPickerTarget={form.setPickerTarget}
            setTitle={form.setTitle}
            title={form.title}
          />

          <BuildLoadoutPanel
            completedSlots={form.completedSlots}
            pickerTarget={form.pickerTarget}
            selectedItems={form.selectedItems}
            setPickerTarget={form.setPickerTarget}
            setSlot={form.setSlot}
            totalCost={form.totalCost}
            version={form.version}
          />
        </div>

        <BuildPickerPanel form={form} />
      </section>

      {form.saveError && (
        <p className="form-error" role="alert">
          {form.saveError}
        </p>
      )}

      <div className="form-actions form-actions--build-create">
        <Link to={cancelPath} className="muted-action">
          <Icon name="chevron-left" size={16} />
          Cancel
        </Link>
        <button
          type="submit"
          disabled={!form.isValid}
          className="primary-action"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
