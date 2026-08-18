import React, { HTMLAttributes, ReactNode } from 'react'

export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardShadow = "none" | "sm" | "md";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
     children: ReactNode;
     padding?: CardPadding;
     shadow?: CardShadow;
     hoverable?: boolean;
}

const PADDING_CLASSES: Record<CardPadding, string> = {
     none: "card-padding-none",
     sm: "card-padding-sm",
     md: "card-padding-md",
     lg: "card-padding-lg",
};

const SHADOW_CLASSES: Record<CardShadow, string> = {
     none: "",
     sm: "card-shadow-sm",
     md: "card-shadow-md",
};

function Card({
     children,
     padding = "md",
     shadow = "none",
     hoverable = false,
     className = "",
     ...props
}: CardProps) {
     const classes = [
          "card",
          PADDING_CLASSES[padding],
          SHADOW_CLASSES[shadow],
          hoverable ? "card-hoverable" : "",
          className,
     ].filter(Boolean).join(" ");
     return (
          <div className={classes} {...props}>
               {children}
          </div>
     )
}

function CardHeader({
     children,
     className = "",
     ...props
}: HTMLAttributes<HTMLDivElement>) {
     return (
          <div className={["card-header", className].filter(Boolean).join(" ")} {...props}>
               {children}
          </div>
     );
}

function CardTitle({
     children,
     className = "",
     ...props
}: HTMLAttributes<HTMLHeadingElement>) {
     return (
          <h3 className={["card-title", className].filter(Boolean).join(" ")} {...props}>
               {children}
          </h3>
     )
}

function CardSubtitle({
     children,
     className = "",
     ...props
}: HTMLAttributes<HTMLParagraphElement>) {
     <p className={["card-subtitle", className].filter(Boolean).join(" ")} {...props}>
          {children}
     </p>
}

function CardFooter({
     children,
     className = "",
     ...props
}: HTMLAttributes<HTMLDivElement>) {
     return (
          <div className={["card-footer", className].filter(Boolean).join(" ")} {...props}>
               {children}
          </div>
     )
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Footer = CardFooter;

export default Card