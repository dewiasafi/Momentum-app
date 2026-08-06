export type FieldSize = "sm" | "md" | "lg";

export interface FieldVariants {
     size?: FieldSize;
     error?: boolean;
}

interface FieldVariantsInput extends FieldVariants {
     className?: string;
}

const BASE_CLASSES =
     "w-full font-sans text-neutral-900 bg-white rounded-md border " +
     "transition-colors duration-75 placeholder:text-neutral-400 " +
     "focus:outline-none focus:ring-2 focus:ring-offset-0 " +
     "disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed";

const SIZE_CLASSES: Record<FieldSize, string> = {
     sm: "px-3 py-1.5 text-sm",
     md: "px-3.5 py-[9px] text-base",
     lg: "px-4 py-2.5 text-lg",
}

const ERROR_CLASSES = "border-error focus:border-error focus:ring-error/20"

const DEFAULT_CLASSES =
     "border-neutral-300 " +
     "[&:hover:not(:disabled):not(:focus)]:border-neutral-400 " +
     "focus:border-primary-500 focus:ring-primary-300";

export function getFieldClassName({
     size = "md",
     error = false,
     className = ""
}: FieldVariantsInput = {}): string {
     return [
          BASE_CLASSES,
          SIZE_CLASSES[size],
          error ? ERROR_CLASSES : DEFAULT_CLASSES,
          className
     ].filter(Boolean).join(" ")
}