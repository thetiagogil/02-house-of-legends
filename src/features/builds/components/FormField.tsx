import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
};

export const FormField = ({ label, htmlFor, children }: FormFieldProps) => {
  return (
    <div className="field">
      <label htmlFor={htmlFor} className="field__label">
        {label}
      </label>
      {children}
    </div>
  );
};
