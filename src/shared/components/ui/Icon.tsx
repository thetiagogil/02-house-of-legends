type IconName =
  | "search"
  | "plus"
  | "minus"
  | "chart"
  | "edit"
  | "x"
  | "trash"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "chevron-down";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export const Icon = ({ name, size = 20, className = "" }: IconProps) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "search" && (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </>
      )}
      {name === "plus" && (
        <>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </>
      )}
      {name === "minus" && <path d="M5 12h14" />}
      {name === "x" && (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      )}
      {name === "chart" && (
        <>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 15v-4" />
          <path d="M12 15V8" />
          <path d="M16 15v-6" />
        </>
      )}
      {name === "edit" && (
        <>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </>
      )}
      {name === "trash" && (
        <>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v5" />
          <path d="M14 11v5" />
        </>
      )}
      {name === "chevron-left" && <path d="m15 18-6-6 6-6" />}
      {name === "chevron-right" && <path d="m9 18 6-6-6-6" />}
      {name === "chevron-up" && <path d="m18 15-6-6-6 6" />}
      {name === "chevron-down" && <path d="m6 9 6 6 6-6" />}
    </svg>
  );
};
