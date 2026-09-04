import { ReactNode, createContext, useContext, useId, useState } from "react";

interface AccordionContextValue {
  openValues: string[];
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion.Item harus dipakai di dalam <Accordion>");
  return ctx;
}

export interface AccordionProps {
  children: ReactNode;
  type?: "single" | "multiple";
  defaultOpen?: string[];
  className?: string;
}

function Accordion({ children, type = "single", defaultOpen = [], className = "" }: AccordionProps) {
  const [openValues, setOpenValues] = useState<string[]>(defaultOpen);

  function toggle(value: string) {
    setOpenValues((prev) => {
      const isOpen = prev.includes(value);
      if (type === "single") {
        return isOpen ? [] : [value];
      }
      return isOpen ? prev.filter((v) => v !== value) : [...prev, value];
    });
  }

  return (
    <AccordionContext.Provider value={{ openValues, toggle }}>
      <div className={["accordion", className].filter(Boolean).join(" ")}>{children}</div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  title: ReactNode;
  children: ReactNode;
}

function AccordionItem({ value, title, children }: AccordionItemProps) {
  const { openValues, toggle } = useAccordionContext();
  const isOpen = openValues.includes(value);
  const idPrefix = useId();

  return (
    <div>
      <button
        type="button"
        id={`${idPrefix}-header`}
        aria-expanded={isOpen}
        aria-controls={`${idPrefix}-panel`}
        onClick={() => toggle(value)}
        className="accordion-item-header"
      >
        <span>{title}</span>
        <svg
          className={["accordion-icon", isOpen ? "accordion-icon-open" : ""].filter(Boolean).join(" ")}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        id={`${idPrefix}-panel`}
        role="region"
        aria-labelledby={`${idPrefix}-header`}
        className={["accordion-panel", isOpen ? "accordion-panel-open" : ""].filter(Boolean).join(" ")}
      >
        <div className="accordion-panel-content">{children}</div>
      </div>
    </div>
  );
}

Accordion.Item = AccordionItem;

export default Accordion;