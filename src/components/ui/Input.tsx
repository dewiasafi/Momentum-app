import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { getFieldClassName, type FieldVariants } from "./field.styles";
import FormField from "./Formfield";

export interface InputProps
     extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
     FieldVariants {
     label?: string;
     helperText?: string;
     errorText?: string;
     fullWidth?: boolean;
     leftIcon?: ReactNode;
     rightIcon?: ReactNode;
     containerClassName?: string;

}

const Input = forwardRef<HTMLInputElement, InputProps>(
     (
          {
               label,
               helperText,
               errorText,
               size,
               fullWidth = false,
               disabled = false,
               leftIcon = null,
               rightIcon = null,
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
                                   <span className="absolute left-3 inset-y-0 flex items-center text-neutral-400 pointer-events-none">
                                        {leftIcon}
                                   </span>
                              )}
                              <input
                                   id={id}
                                   ref={ref}
                                   disabled={disabled}
                                   required={required}
                                   aria-invalid={hasError || undefined}
                                   aria-describedby={describedBy}
                                   className={getFieldClassName({
                                        size,
                                        error: hasError,
                                        className: [leftIcon ? "pl-9" : "", rightIcon ? "pr-9" : "", className]
                                             .filter(Boolean).join(" ")
                                   })}
                                   {...props}
                              />
                              {rightIcon && (
                                   <span className="absolute right-3 inset-y-0 flex items-center text-neutral-400 pointer-events-none">
                                        {rightIcon}
                                   </span>
                              )}
                         </div>

                    )}
               </FormField>
          );
     }
);

Input.displayName = "Input"

export default Input