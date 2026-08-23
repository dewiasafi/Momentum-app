import { CSSProperties, HTMLAttributes } from "react";

export type SkeletonVariant = "rect" | "text" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  variant = "rect",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const variantClass =
    variant === "text"
      ? "skeleton-text"
      : variant === "circle"
        ? "skeleton-circle"
        : "";
  const classes = ["skeleton", variantClass, className]
    .filter(Boolean)
    .join(" ");

  const inlineStyle: CSSProperties = { width, height, ...style };

  return (
    <div
      className={classes}
      style={inlineStyle}
      aria-hidden="true"
      {...props}
    />
  );
}

export interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = "60%",
  className = "",
}: SkeletonTextProps) {
  return (
    <div
      className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}
