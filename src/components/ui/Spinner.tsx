import { HTMLAttributes } from "react";

export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerColor = "neutral" | "primary" | "white";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
}

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: "spinner-sm",
  md: "spinner-md",
  lg: "spinner-lg",
};

const COLOR_CLASSES: Record<SpinnerColor, string> = {
  neutral: "spinner-neutral",
  primary: "spinner-primary",
  white: "spinner-white",
};

export default function Spinner({
  size = "md",
  color = "primary",
  label = "Memuat...",
  className = "",
  ...props
}: SpinnerProps) {
  const classes = ["spinner", SIZE_CLASSES[size], COLOR_CLASSES[color], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span role="status" className={classes} {...props}>
      <span className="sr-only">{label}</span>
    </span>
  );
}