import {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type DrawerSide = "right" | "left" | "top" | "bottom";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: DrawerSide;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const SIDE_CLASSES: Record<DrawerSide, string> = {
  right: "drawer-right",
  left: "drawer-left",
  top: "drawer-top",
  bottom: "drawer-bottom",
};

const EXIT_DURATION = 200; // samain sama duration-200 di CSS

function Drawer({
  open,
  onClose,
  children,
  side = "right",
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: DrawerProps) {
  // `shouldRender` tetap true selama animasi exit berlangsung, biar
  // drawer nggak ilang instan pas ditutup — beda dari Modal yang
  // langsung unmount tanpa animasi
  const [shouldRender, setShouldRender] = useState(open);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const enterTimer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(enterTimer);
    }
    setVisible(false);
    const exitTimer = setTimeout(() => setShouldRender(false), EXIT_DURATION);
    return () => clearTimeout(exitTimer);
  }, [open]);

  useEffect(() => {
    if (!shouldRender) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!open || !closeOnEscape) return;
    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, closeOnEscape, onClose]);

  useEffect(() => {
    if (!visible || !panelRef.current) return;
    const focusable = panelRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [visible]);

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

  if (!shouldRender) return null;

  return createPortal(
    <>
      <div
        className={["drawer-backdrop", visible ? "drawer-backdrop-visible" : "drawer-backdrop-enter"].join(
          " "
        )}
        onClick={() => closeOnBackdropClick && onClose()}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={[
          "drawer-panel",
          SIDE_CLASSES[side],
          visible ? "drawer-visible" : "drawer-enter",
        ].join(" ")}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </>,
    document.body
  );
}

function DrawerHeader({
  children,
  onClose,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  return (
    <div className={["drawer-header", className].filter(Boolean).join(" ")} {...props}>
      <div>{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Tutup" className="drawer-close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

function DrawerTitle({ children, className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={["drawer-title", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </h2>
  );
}

function DrawerBody({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["drawer-body", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

function DrawerFooter({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={["drawer-footer", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

Drawer.Header = DrawerHeader;
Drawer.Title = DrawerTitle;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;

export default Drawer;