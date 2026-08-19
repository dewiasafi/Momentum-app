import {
     ReactNode, useEffect, useRef, KeyboardEvent as ReactKeyboardEvent,
     HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";

export type ModalSize = "sm" | "md" | "lg"

export interface ModalProps {
     open: boolean;
     onClose: () => void;
     children: ReactNode;
     size?: ModalSize;
     closeOnBackdropClick?: boolean;
     closeOnEscape?: boolean;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
     sm: "modal-sm",
     md: "modal-md",
     lg: "modal-lg",
};


function Modal({
     open,
     onClose,
     children,
     size = "md",
     closeOnBackdropClick = true,
     closeOnEscape = true
}: ModalProps) {
     const panelRef = useRef<HTMLDivElement>(null)

     useEffect(() => {
          if (!open) return;
          const original = document.body.style.overflow;
          document.body.style.overflow = "hidden";
          return () => {
               document.body.style.overflow = original;
          };
     }, [open]);

     useEffect(() => {
          if (!open || !closeOnEscape) return;
          function handleKeyDown(event: globalThis.KeyboardEvent) {
               if (event.key === "Escape") onClose();
          }
          document.addEventListener("keydown", handleKeyDown);
          return () => document.removeEventListener("keydown", handleKeyDown);
     }, [open, closeOnEscape, onClose]);

     useEffect(() => {
          if (!open || !panelRef.current) return;
          const focusable = panelRef.current.querySelector<HTMLElement>(
               'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          focusable?.focus();
     }, [open]);

     function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
          if (event.key !== "Tab" || !panelRef.current) return;
          const focusableEls = panelRef.current.querySelectorAll<HTMLElement>(
               'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableEls.length === 0) return;

          const first = focusableEls[0];
          const last = focusableEls[focusableEls.length - 1];

          if (event.shiftKey && document.activeElement === first) {
               event.preventDefault();
               last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
               event.preventDefault();
               first.focus();
          }
     }

     if (!open) return;

     return createPortal(
          <div
               className="modal-backdrop"
               onClick={(e) => {
                    if (closeOnBackdropClick && e.target === e.currentTarget) onClose();
               }}>
               <div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    className={["modal-panel", SIZE_CLASSES[size]].join(" ")}
                    onKeyDown={handleKeyDown}
               >
                    {children}
               </div>
          </div>,
          document.body
     );
}

function ModalHeader({
     children,
     onClose,
     className = "",
     ...props
}: HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
     return (
          <div className={["modal-header", className].filter(Boolean).join(" ")} {...props}>
               <div>{children}</div>
               {onClose && (
                    <button type="button" onClick={onClose} aria-label="Tutup" className="modal-close">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                         </svg>
                    </button>
               )}
          </div>
     )
}

function ModalTitle({ children, className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
     return (
          <h2 className={["modal-title", className].filter(Boolean).join(" ")} {...props}>
               {children}
          </h2>
     );
}

function ModalBody({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
     return (
          <div className={["modal-body", className].filter(Boolean).join(" ")} {...props}>
               {children}
          </div>
     );
}

function ModalFooter({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
     return (
          <div className={["modal-footer", className].filter(Boolean).join(" ")} {...props}>
               {children}
          </div>
     );
}

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal