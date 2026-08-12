import { forwardRef, ReactNode, SelectHTMLAttributes } from "react";
import { type FieldVariants, getFieldClassName } from "./field.styles";
import FormField from "./FormField";

export interface SelectOption {
     label: string;
     value: string;
     disabled?: boolean;
}

export interface SelectProps
     extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
     FieldVariants {
     label?: string;
     helperText?: string;
     errorText?: string;
     fullWidth?: boolean;
     placeholder?: string;
     options: SelectOption[];
     leftIcon?: ReactNode;
     containerClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
     (
          {
               label,
               helperText,
               errorText,
               size,
               fullWidth = false,
               disabled = false,
               placeholder,
               options,
               leftIcon = null,
               className = "",
               containerClassName = "",
               required,
               ...props
          },
          ref
     ) => {
          const hasError = Boolean(errorText);

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
                         <div className="relative flex items-center">
                              {leftIcon && (
                                   <span className="absolute left-3 inset-y-0 flex items-center text-neutral-400 pointer-events-none z-10">
                                        {leftIcon}
                                   </span>
                              )}

                              <select
                                   id={id}
                                   ref={ref}
                                   disabled={disabled}
                                   required={required}
                                   aria-invalid={hasError || undefined}
                                   aria-describedby={describedBy}
                                   className={getFieldClassName({
                                        size,
                                        error: hasError,
                                        className: [
                                             "appearance-none pr-9 cursor-pointer",
                                             leftIcon ? "pl-9" : "",
                                             className,
                                        ]
                                             .filter(Boolean)
                                             .join(" "),
                                   })}
                                   {...props}
                              >
                                   {placeholder && (
                                        <option value="" disabled hidden>
                                             {placeholder}
                                        </option>
                                   )}

                                   {options.map((opt) => (
                                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                                             {opt.label}
                                        </option>
                                   ))}
                              </select>

                              <span className="absolute right-3 inset-y-0 flex items-center text-neutral-400 pointer-events-none">
                                   <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        aria-hidden="true"
                                   >
                                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                   </svg>
                              </span>
                         </div>
                    )}
               </FormField>
          );
     }
);

Select.displayName = "Select";

export default Select;