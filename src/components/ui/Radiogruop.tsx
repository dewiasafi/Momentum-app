import { useId } from "react";
import type { FieldSize } from "./field.styles";
import FormField from "./Formfield";

const CIRCLE_SIZE_CLASSES: Record<FieldSize, string> = {
     sm: "radio-circle-sm",
     md: "radio-circle-md",
     lg: "radio-circle-lg",
}

const LABEL_SIZE_CLASSES: Record<FieldSize, string> = {
     sm: "radio-label-text-sm",
     md: "radio-label-text-md",
     lg: "radio-label-text-lg",
}

export interface RadioOption {
     label: string;
     value: string;
     description?: string;
     disabled?: boolean;
}

export interface RadioGroupProps {
     label?: string;
     helperText?: string;
     errorText?: string;
     required?: boolean;
     fullWidth?: boolean;
     name?: string;
     value?: string;
     onChange?: (value: string) => void;
     options: RadioOption[];
     direction?: "vertical" | "horizontal";
     size?: FieldSize;
     disabled?: boolean;
     containerClassName?: string;
}

export default function Radiogruop({
     label,
     helperText,
     errorText,
     required,
     fullWidth = false,
     name,
     value,
     onChange,
     options,
     direction = "vertical",
     size = "md",
     disabled = false,
     containerClassName = "",
}: RadioGroupProps) {
     const generatedName = useId();
     const groupName = name ?? generatedName;

     return (
          <FormField
               label={label}
               required={required}
               helperText={helperText}
               errorText={errorText}
               fullWidth={fullWidth}
               className={containerClassName}
          >
               {(id, describedBy) => (
                    <div
                         role="radiogroup"
                         aria-describedby={describedBy}
                         className={["radio-group", direction === "horizontal" ? "radio-group-horizontal" : ""].filter(Boolean).join(" ")}
                    >
                         {options.map((opt) => {
                              const optionId = `${id}-${opt.value}`;
                              const isDisabled = disabled || opt.disabled;

                              return (
                                   <div key={opt.value} className="radio-wrapper">
                                        <div className="radio-indicator">
                                             <input
                                                  type="radio"
                                                  id={optionId}
                                                  name={groupName}
                                                  value={opt.value}
                                                  checked={value === opt.value}
                                                  disabled={isDisabled}
                                                  onChange={() => onChange?.(opt.value)}
                                                  className="peer radio-input"
                                             />
                                             <div
                                                  aria-hidden="true"
                                                  className={["radio-circle", CIRCLE_SIZE_CLASSES[size]].join(" ")}
                                             />
                                        </div>

                                        <label
                                             htmlFor={optionId}
                                             className={isDisabled ? "radio-label radio-label-disabled" : "radio-label"}
                                        >
                                             <p className={["radio-label-text", LABEL_SIZE_CLASSES[size]].join(" ")}>
                                                  {opt.label}
                                             </p>
                                             {opt.description && <p className="radio-description">{opt.description}</p>}
                                        </label>
                                   </div>
                              );
                         })}
                    </div>
               )}
          </FormField>
     )
}
