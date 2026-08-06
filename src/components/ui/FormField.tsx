import { ReactNode, useId } from "react";

export interface FormFieldProps {
     label?: string;
     required?: boolean;
     helperText?: string;
     errorText?: string;
     fullWidth?: boolean;
     className?: string;
     footerExtra?: ReactNode;
     children: (id: string, describedBy: string | undefined) => ReactNode;
}

export default function FormField({
     label,
     required,
     helperText,
     errorText,
     fullWidth,
     className = "",
     footerExtra,
     children,
}: FormFieldProps) {
     const id = useId();
     const hasFooter = Boolean(errorText || helperText || footerExtra);
     const describedBy = errorText ? `${id}-error` : helperText ? `${id}-helper` : undefined;

     return (
          <div className={[fullWidth? "w-full": "", className].filter(Boolean).join(" ")}>
               {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1">
                         {label}
                         {required && <span className="text-error"> *</span> }
                    </label>
               )}

               {children(id, describedBy)}

               {hasFooter && (
                    <div className="mt-1 flex items-start justify-between gap-2">
                         <div>
                              {errorText ? (
                                   <p id={`${id}-error`} className="text-xs text-error">
                                        {errorText}
                                   </p>
                              ) : helperText ? (
                                   <p id={`${id}-helper`} className="text-xs text-neutral-500">
                                        {helperText}
                                   </p>
                              ) : null}
                         </div>
                         {footerExtra}
                    </div>
               )}
          </div>
     )
}