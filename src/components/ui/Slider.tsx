import { InputHTMLAttributes, forwardRef } from "react";
import FormField from "./FormField";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  helperText?: string;
  errorText?: string;
  /** nampilin angka value di kanan slider */
  showValue?: boolean;
  fullWidth?: boolean;
  containerClassName?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      helperText,
      errorText,
      showValue = false,
      fullWidth = false,
      min = 0,
      max = 100,
      value,
      defaultValue,
      disabled = false,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    const numericMin = Number(min);
    const numericMax = Number(max);
    const numericValue = Number(value ?? defaultValue ?? numericMin);
    const percent = ((numericValue - numericMin) / (numericMax - numericMin)) * 100;

    // Track fill pakai linear-gradient: bagian kiri (sampai posisi
    // value) diwarnain primary, sisanya abu-abu — dihitung ulang tiap
    // render, bukan CSS statis, karena posisinya berubah-ubah sesuai value
    const fillStyle = {
      background: `linear-gradient(to right, var(--color-primary-500) ${percent}%, var(--color-neutral-200) ${percent}%)`,
    };

    return (
      <FormField
        label={label}
        helperText={helperText}
        errorText={errorText}
        fullWidth={fullWidth}
        className={containerClassName}
      >
        {(id) => (
          <div className="slider-row">
            <input
              type="range"
              id={id}
              ref={ref}
              min={min}
              max={max}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              className={["slider", className].filter(Boolean).join(" ")}
              style={fillStyle}
              {...props}
            />
            {showValue && <span className="slider-value">{numericValue}</span>}
          </div>
        )}
      </FormField>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;