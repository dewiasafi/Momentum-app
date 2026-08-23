import {
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface DropdownContextValue {
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdownClose() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("useDropdownClose harus dipanggil di dalam <Dropdown>");
  return ctx.close;
}

export interface DropdownProps {
  trigger: ReactElement;
  children: ReactNode;
  align?: "left" | "right";
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

function Dropdown({
  trigger,
  children,
  align = "left",
  closeOnOutsideClick = true,
  closeOnEscape = true,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  function close() {
    setOpen(false);
  }

  useEffect(() => {
    if (!open || !closeOnOutsideClick) return;
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, closeOnOutsideClick]);

  useEffect(() => {
    if (!open || !closeOnEscape) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const panel = wrapperRef.current?.querySelector('[role="menu"]');
        const items = Array.from(
          panel?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? []
        );
        if (items.length === 0) return;
        const currentIndex = items.findIndex((el) => el === document.activeElement);
        let nextIndex = event.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex < 0) nextIndex = items.length - 1;
        if (nextIndex >= items.length) nextIndex = 0;
        items[nextIndex].focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEscape]);

  const triggerElement = cloneElement(trigger, {
    ref: triggerRef,
    "aria-haspopup": "menu",
    "aria-expanded": open,
    onClick: (e: React.MouseEvent) => {
      (trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e);
      setOpen((prev) => !prev);
    },
  } as Record<string, unknown>);

  return (
    <DropdownContext.Provider value={{ close }}>
      <div ref={wrapperRef} className="dropdown-wrapper">
        {triggerElement}

        {open && (
          <div
            role="menu"
            className={[
              "dropdown-panel",
              align === "right" ? "dropdown-panel-right" : "dropdown-panel-left",
            ].join(" ")}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
}

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: "default" | "danger";
  closeOnClick?: boolean;
}

function DropdownItem({
  icon,
  variant = "default",
  closeOnClick = true,
  onClick,
  children,
  className = "",
  ...props
}: DropdownItemProps) {
  const close = useDropdownClose();

  const classes = ["dropdown-item", variant === "danger" ? "dropdown-item-danger" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      role="menuitem"
      className={classes}
      onClick={(e) => {
        onClick?.(e);
        if (closeOnClick) close();
      }}
      {...props}
    >
      {icon && <span className="dropdown-item-icon">{icon}</span>}
      {children}
    </button>
  );
}

function DropdownDivider() {
  return <div role="separator" className="dropdown-divider" />;
}

function DropdownLabel({ children }: { children: ReactNode }) {
  return <div className="dropdown-label">{children}</div>;
}

Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;
Dropdown.Label = DropdownLabel;

export default Dropdown;