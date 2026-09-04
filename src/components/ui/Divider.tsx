import React, { HTMLAttributes, ReactNode } from 'react'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
     orientation?: "horizontal" | "vertical";
     label?: ReactNode
}

export default function Divider({
     orientation = "horizontal",
     label,
     className = "",
     ...props
}: DividerProps) {
     if (label) {
          return (
               <div role="separator" className={["divider-with-label", className].filter(Boolean).join(" ")} {...props}>
                    <span className="divider-label-text">{label}</span>
               </div>
          );
     }

     const classes = [
          orientation === "vertical" ? "divider-vertical" : "divider-horizontal",
          className,
     ]
          .filter(Boolean)
          .join(" ");

     return <div role="separator" aria-orientation={orientation} className={classes} {...props} />;
}
