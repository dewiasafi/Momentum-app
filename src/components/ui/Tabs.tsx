import { Children, createContext, isValidElement, KeyboardEvent, ReactElement, ReactNode, useContext, useId, useState } from "react";

type TabsVariant = "underline" | "pill";

interface TabsContextValue {
     value: string;
     setValue: (value: string) => void;
     idPrefix: string;
     variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
     const ctx = useContext(TabsContext);
     if (!ctx) throw new Error("Tabs.Item harus dipakai di dalam <Tabs>");
     return ctx;
}

export interface TabsItemProps {
     value: string;
     label: ReactNode;
     icon?: ReactNode;
     disabled?: boolean;
     children?: ReactNode;
}

function TabsItem(_props: TabsItemProps) {
     return null;
}

interface NormalizesTabItem {
     value: string;
     label: ReactNode;
     icon?: ReactNode;
     disabled?: boolean;
     content: ReactNode;
}

function normalizeItems(
     items: TabsItemProps[] | undefined,
     children: ReactNode
): NormalizesTabItem[] {
     if (items) {
          return items.map((item) => ({
               value: item.value,
               label: item.label,
               icon: item.icon,
               disabled: item.disabled,
               content: item.children,
          }));
     }
     const childArray = Children.toArray(children) as ReactElement<TabsItemProps>[];

     return childArray
          .filter((child) => isValidElement(child) && child.type === TabsItem)
          .map((c) => ({
               value: c.props.value,
               label: c.props.label,
               icon: c.props.icon,
               disabled: c.props.disabled,
               content: c.props.children,
          }));
}

export interface TabsProps {
     value?: string;
     defaultValue?: string;
     onChange?: (value: string) => void;
     variant?: TabsVariant;
     className?: string;
     items?: TabsItemProps[];
     children?: ReactNode;
}

function Tabs({
     value,
     defaultValue,
     onChange,
     variant = "underline",
     items,
     children,
     className = "",
}: TabsProps) {
     const idPrefix = useId();
     const [internalValue, setInternalValue] = useState(defaultValue ?? "");
     const isControlled = value !== undefined;
     const currentValue = isControlled ? value : internalValue;

     function setValue(next: string) {
          if (!isControlled) setInternalValue(next);
          onChange?.(next);
     }

     const tabItems = normalizeItems(items, children);

     function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
          const buttons = Array.from(
               event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')
          );
          const currentIndex = buttons.findIndex((t) => t === document.activeElement);
          if (currentIndex === -1) return;

          let nextIndex: number | null = null;
          if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % buttons.length;
          if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
          if (event.key === "Home") nextIndex = 0;
          if (event.key === "End") nextIndex = buttons.length - 1;

          if (nextIndex !== null) {
               event.preventDefault();
               buttons[nextIndex].focus();
               buttons[nextIndex].click();
          }
     }

     const listClasses = ["tabs-list", variant === "pill" ? "tabs-list-pill" : ""]
          .filter(Boolean)
          .join(" ");

     return (
          <TabsContext.Provider value={{ value: currentValue, setValue, idPrefix, variant }}>
               <div className={className}>
                    <div role="tablist" className={listClasses} onKeyDown={handleKeyDown}>
                         {tabItems.map((item) => (
                              <TabHeadButton key={item.value} item={item} />
                         ))}
                    </div>

                    {tabItems.map((item) => (
                         <TabPanelContent key={item.value} item={item} />
                    ))}
               </div>
          </TabsContext.Provider>
     );
}

function TabHeadButton({ item }: { item: NormalizesTabItem }) {
     const { value, setValue, idPrefix, variant } = useTabsContext();
     const isActive = value === item.value;

     const classes = [
          "tab-head",
          variant === "pill" ? "tab-head-pill" : "",
          isActive ? "tab-head-active" : ""
     ]
          .filter(Boolean)
          .join(" ");

     return (
          <button
               type="button"
               role="tab"
               id={`${idPrefix}-tab-${item.value}`}
               aria-selected={isActive}
               aria-controls={`${idPrefix}-panel-${item.value}`}
               tabIndex={isActive ? 0 : -1}
               disabled={item.disabled}
               onClick={() => setValue(item.value)}
               className={classes}
          >
               {item.icon && <span className="tab-head-icon"></span>}
               {item.label}
          </button>
     )
}

function TabPanelContent({ item }: { item: NormalizesTabItem }) {
     const { value, idPrefix } = useTabsContext();
     if (value !== item.value) return null

     return (
          <div
               className="tab-panel"
               role="tabpanel"
               id={`${idPrefix}-panel-${item.value}`}
               aria-labelledby={`${idPrefix}-tab-${item.value}`}
          >
               {item.content}
          </div>
     )
}

Tabs.Item = TabsItem;

export default Tabs;