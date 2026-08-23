import { ReactElement, ReactNode, cloneElement, useEffect, useId, useRef, useState } from "react";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  position?: TooltipPosition;
  delay?: number;
}

const POSITION_CLASSES: Record<TooltipPosition, string> = {
  top: "tooltip-top",
  bottom: "tooltip-bottom",
  left: "tooltip-left",
  right: "tooltip-right",
};

export default function Tooltip({ content, children, position = "top", delay = 300 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function show() {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }

  function hide() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }

  const childProps = children.props as Record<string, unknown>;
  const trigger = cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      (childProps.onMouseEnter as (e: React.MouseEvent) => void)?.(e);
      show();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      (childProps.onMouseLeave as (e: React.MouseEvent) => void)?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      (childProps.onFocus as (e: React.FocusEvent) => void)?.(e);
      show();
    },
    onBlur: (e: React.FocusEvent) => {
      (childProps.onBlur as (e: React.FocusEvent) => void)?.(e);
      hide();
    },
    "aria-describedby": id,
  } as Record<string, unknown>);

  return (
    <span className="tooltip-wrapper">
      {trigger}
      <span
        role="tooltip"
        id={id}
        className={["tooltip-bubble", POSITION_CLASSES[position], visible ? "tooltip-visible" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        {content}
        <span className="tooltip-arrow" aria-hidden="true" />
      </span>
    </span>
  );
}