import { forwardRef, TextareaHTMLAttributes } from "react";
import { getFieldClassName, type FieldVariants } from "./field.styles";
import FormField from "./FormField";

export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

const RESIZE_CLASSES: Record<TextareaResize, string> = {
     none: "resize-none",
     vertical: "resize-y",
     horizontal: "resize-x",
     both: "resize",
};

export interface TextareaProps
     extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
     FieldVariants {
     label?: string;
     helperText?: string;
     errorText?: string;
     resize?: TextareaResize;
     fullWidth?: boolean;
     showCount?: boolean;
     containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
     (
          {
               label,
               helperText,
               errorText,
               size,
               resize = "vertical",
               fullWidth = false,
               showCount = false,
               disabled = false,
               className = "",
               containerClassName = "",
               required,
               maxLength,
               value,
               defaultValue,
               ...props
          },
          ref
     ) => {
          const hasError = Boolean(errorText);
          const currentLength =
               typeof value === "string"
                    ? value.length
                    : typeof defaultValue === "string"
                         ? defaultValue.length
                         : 0;

          return (
               <FormField
                    label={label}
                    required={required}
                    helperText={helperText}
                    errorText={errorText}
                    fullWidth={fullWidth}
                    className={containerClassName}
                    footerExtra={
                         showCount && maxLength ? (
                              <p className="text-xs text-neutral-400 whitespace-nowrap">
                                   {currentLength}/{maxLength}
                              </p>
                         ) : undefined
                    }
               >
                    {(id, describedBy) => (
                         <textarea
                              id={id}
                              ref={ref}
                              disabled={disabled}
                              required={required}
                              maxLength={maxLength}
                              value={value}
                              defaultValue={defaultValue}
                              aria-invalid={hasError || undefined}
                              aria-describedby={describedBy}
                              className={getFieldClassName({
                                   size,
                                   error: hasError,
                                   className: [RESIZE_CLASSES[resize], className].filter(Boolean).join(" "),
                              })}
                              {...props}
                         />
                    )}
               </FormField>
          );
     }
);

Textarea.displayName = "Textarea"

export default Textarea
