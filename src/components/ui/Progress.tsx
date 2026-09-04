import { HTMLAttributes } from "react";

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressColor = "primary" | "success" | "warning" | "error";

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  /** 0–100 */
  value: number;
  size?: ProgressSize;
  color?: ProgressColor;
  label?: string;
  /** nampilin angka persen di kanan label — cuma kepakai kalau `label` diisi */
  showValue?: boolean;
}

const SIZE_CLASSES: Record<ProgressSize, string> = {
  sm: "progress-sm",
  md: "progress-md",
  lg: "progress-lg",
};

const COLOR_CLASSES: Record<ProgressColor, string> = {
  primary: "progress-fill-primary",
  success: "progress-fill-success",
  warning: "progress-fill-warning",
  error: "progress-fill-error",
};

export default function Progress({
  value,
  size = "md",
  color = "primary",
  label,
  showValue = false,
  className = "",
  ...props
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={className}>
      {label && (
        <div className="progress-label-row">
          <span className="progress-label">{label}</span>
          {showValue && <span className="progress-value">{Math.round(clampedValue)}%</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={!label ? "Progress" : undefined}
        className={["progress-track", SIZE_CLASSES[size]].join(" ")}
        {...props}
      >
        <div
          className={["progress-fill", COLOR_CLASSES[color]].join(" ")}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}