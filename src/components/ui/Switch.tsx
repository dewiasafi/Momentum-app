import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import FormField from "./FormField";
import type { FieldSize } from "./field.styles";

const TRACK_SIZE_CLASSES: Record<FieldSize, string> = {
  sm: "switch-track-sm",
  md: "switch-track-md",
  lg: "switch-track-lg",
};

const LABEL_SIZE_CLASSES: Record<FieldSize, string> = {
  sm: "switch-label-text-sm",
  md: "switch-label-text-md",
  lg: "switch-label-text-lg",
};

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  description?: string;
  size?: FieldSize;
  helperText?: string;
  errorText?: string;
  containerClassName?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      size = "md",
      helperText,
      errorText,
      disabled = false,
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref
  ) => {
    return (
      <FormField helperText={helperText} errorText={errorText} className={containerClassName}>
        {(fieldId, describedBy) => {
          const switchId = id ?? fieldId;

          return (
            <div className="switch-wrapper">
              <div className="switch-indicator">
                <input
                  type="checkbox"
                  role="switch"
                  id={switchId}
                  ref={ref}
                  disabled={disabled}
                  aria-describedby={describedBy}
                  className={["peer", "switch-input", className].filter(Boolean).join(" ")}
                  {...props}
                />
                <label htmlFor={switchId} className={["switch-track", TRACK_SIZE_CLASSES[size]].join(" ")} />
              </div>

              {(label || description) && (
                <label
                  htmlFor={switchId}
                  className={disabled ? "switch-label switch-label-disabled" : "switch-label"}
                >
                  {label && (
                    <p className={["switch-label-text", LABEL_SIZE_CLASSES[size]].join(" ")}>{label}</p>
                  )}
                  {description && <p className="switch-description">{description}</p>}
                </label>
              )}
            </div>
          );
        }}
      </FormField>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;