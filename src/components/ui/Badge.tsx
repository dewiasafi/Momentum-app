import { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "error" | "info";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
     children: ReactNode;
     variant?: BadgeVariant;
     size?: BadgeSize;
     dot?: boolean; // titik di kiri sebagai indikator aktif/online
     onRemove?: () => void;
     removeLabel?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
     neutral: "badge-neutral",
     primary: "badge-primary",
     success: "badge-success",
     warning: "badge-warning",
     error: "badge-error",
     info: "badge-info",
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
     sm: "badge-sm",
     md: "badge-md",
     lg: "badge-lg",
};


export default function Badge({
     children,
     variant = "neutral",
     size = "md",
     dot = false,
     onRemove,
     removeLabel = "Hapus",
     className = "",
     ...props
}: BadgeProps) {
     const classes = ["badge", VARIANT_CLASSES[variant], SIZE_CLASSES[size], className].filter(Boolean).join(" ");

     return (
          <span className={classes} {...props}>
               {dot && <span aria-hidden="true" className="badge-dot" />}
               {children}
               {onRemove && (
                    <button
                         type="button"
                         onClick={onRemove}
                         aria-label={removeLabel}
                         className="badge-remove"
                    >
                         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                   d="M18 6L6 18M6 6l12 12"
                                   stroke="currentColor"
                                   strokeWidth="2.5"
                                   strokeLinecap="round"
                              />
                         </svg>
                    </button>
               )}
          </span>
     )
}
