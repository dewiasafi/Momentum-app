import { forwardRef, InputHTMLAttributes, ReactNode, useEffect, useRef } from "react";
import type { FieldSize } from "./field.styles";
import FormField from "./FormField";

export type CheckboxShape = "square" | "circle";

const BOX_SIZE_CLASSES: Record<FieldSize, string> = {
     sm: "checkbox-box-sm",
     md: "checkbox-box-md",
     lg: "checkbox-box-lg",
}

const SHAPE_CLASSES: Record<CheckboxShape, string> = {
     square: "rounded-xs",
     circle: "rounded-full",
}

const LABEL_SIZE_CLASSES: Record<FieldSize, string> = {
     sm: "checkbox-label-text-sm",
     md: "checkbox-label-text-md",
     lg: "checkbox-label-text-lg",
}

const ICON_SIZE_PX: Record<FieldSize, { check: number, dash: number }> = {
     sm: { check: 9, dash: 7 },
     md: { check: 12, dash: 10 },
     lg: { check: 13, dash: 11 },
}

export interface CheckboxProps
     extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
     label?: ReactNode;
     description?: string;
     indeterminate?: boolean;
     helperText?: string;
     errorText?: string;
     containerClassName?: string;
     size?: FieldSize;
     shape?: CheckboxShape;
     borderClassName?: string; // <-- Tambahan untuk kustomisasi border oleh user
}

function mergeRefs<T>(
     ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
     return (node) => {
          refs.forEach((ref) => {
               if (!ref) return;
               if (typeof ref === "function") ref(node);
               else (ref as React.MutableRefObject<T | null>).current = node;
          });
     };
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
     (
          {
               label,
               description,
               indeterminate = false,
               size = "md",
               shape = "square",
               helperText,
               errorText,
               disabled = false,
               className = "",
               containerClassName = "",
               borderClassName = "",
               id,
               ...props
          },
          ref
     ) => {
          const internalRef = useRef<HTMLInputElement>(null)

          useEffect(() => {
               if (internalRef.current) {
                    internalRef.current.indeterminate = indeterminate
               }
          }, [indeterminate])

          return (
               <FormField
                    helperText={helperText}
                    errorText={errorText}
                    className={containerClassName}
               >
                    {(fieldId, describedBy) => {
                         const checkboxId = id ?? fieldId;

                         return (
                              <div className="checkbox-wrapper">
                                   {/* --- TEMPAT MASUKNYA KODE TERSEBUT --- */}
                                   <div className="checkbox-indicator">
                                        <input
                                             type="checkbox"
                                             id={checkboxId}
                                             disabled={disabled}
                                             ref={mergeRefs(ref, internalRef)}
                                             aria-describedby={describedBy}
                                             className={["checkbox-input", className].filter(Boolean).join(" ")}
                                             {...props}
                                        />
                                        <div 
                                             aria-hidden="true" 
                                             className={[
                                                  "checkbox-box", 
                                                  BOX_SIZE_CLASSES[size], 
                                                  SHAPE_CLASSES[shape],
                                                  borderClassName 
                                             ].filter(Boolean).join(" ")}
                                        >
                                             {indeterminate ? (
                                                  <svg
                                                       width={ICON_SIZE_PX[size].dash}
                                                       height={ICON_SIZE_PX[size].dash}
                                                       viewBox="0 0 24 24"
                                                       fill="none"
                                                       className="checkbox-icon"
                                                  >
                                                       <path d="M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                  </svg>
                                             ) : (
                                                  <svg
                                                       width={ICON_SIZE_PX[size].check}
                                                       height={ICON_SIZE_PX[size].check}
                                                       viewBox="0 0 24 24"
                                                       fill="none"
                                                       className="checkbox-icon"
                                                  >
                                                       <path
                                                            d="M5 13l4 4L19 7"
                                                            stroke="currentColor"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                       />
                                                  </svg>
                                             )}
                                        </div>
                                   </div>
                                   {/* ------------------------------------- */}

                                   {(label || description) && (
                                        <label
                                             htmlFor={checkboxId}
                                             className={disabled ? "checkbox-label checkbox-label-disabled" : "checkbox-label"}
                                        >
                                             {label && <p className={["checkbox-label-text", LABEL_SIZE_CLASSES[size]].join(" ")}>{label}</p>}
                                             {description && <p className="checkbox-description">{description}</p>}
                                        </label>
                                   )}
                              </div>
                         );
                    }}
               </FormField>
          );
     }
);
Checkbox.displayName = "Checkbox";
export default Checkbox;