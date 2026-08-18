import { HTMLAttributes, ReactNode } from "react";

export type AlertVariant = "success" | "warning" | "error" | "info";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title?: ReactNode;
  children?: ReactNode;
  showIcon?: boolean;
  onClose?: () => void;
  closeLabel?: string;
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
  info: "alert-info",
};

function VariantIcon({ variant }: { variant: AlertVariant }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
  };

  switch (variant) {
    case "success":
      return (
        <svg {...common}>
          <path
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "warning":
      return (
        <svg {...common}>
          <path
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "error":
      return (
        <svg {...common}>
          <path
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <path
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export default function Alert({
  variant = "info",
  title,
  children,
  showIcon = true,
  onClose,
  closeLabel = "Tutup",
  className = "",
  ...props
}: AlertProps) {
  const classes = ["alert", VARIANT_CLASSES[variant], className].filter(Boolean).join(" ");

  return (
    <div role="alert" className={classes} {...props}>
      {showIcon && (
        <span className="alert-icon">
          <VariantIcon variant={variant} />
        </span>
      )}

      <div className="alert-body">
        {title && <p className="alert-title">{title}</p>}
        {children && <div className="alert-description">{children}</div>}
      </div>

      {onClose && (
        <button type="button" onClick={onClose} aria-label={closeLabel} className="alert-close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}