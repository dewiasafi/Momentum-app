import { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
export type ButtonSize = "sm" | "md" | "lg"

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const VARIANT_CLASSES : Record<ButtonVariant, string> = {
     primary: "btn-primary",
     secondary: "btn-secondary",
     ghost: "btn-ghost",
     danger: "btn-danger",
}

const SIZE_CLASSES : Record<ButtonSize, string> = {
     sm: "btn-sm",
     md: "btn-md",
     lg: "btn-lg",
}

function Spinner({ className = "" }: { className?: string }) {
     return (
          <svg 
               className={`animate-spin h-4 w-4 ${className}`}
               viewBox="0 0 24 24"
               fill="none"
               aria-hidden="true"
          >
               <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
               />
               <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
               />
          </svg>
     )
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  className = "",
  onClick,
  ...props
}: ButtonProps) {
     const isDisabled = disabled || loading;

     const classes = [
          "btn",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          fullWidth ? "w-full" : "",
          className,
          ]
          .filter(Boolean)
          .join(" ");
     
     return (
          <button
               type={type}
               className={classes}
               disabled={isDisabled}
               aria-busy={loading || undefined}
               onClick={onClick}
               {...props}
          >
               {loading && <Spinner />}
               {!loading && leftIcon}
               {children}
               {!loading && rightIcon}
          </button>
     )
}