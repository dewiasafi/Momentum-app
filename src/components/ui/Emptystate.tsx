import { HTMLAttributes, ReactNode } from "react";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** icon atau ilustrasi SVG — dikasih default kalau nggak diisi */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** biasanya <Button onClick={...}>Tambah Data</Button> */
  action?: ReactNode;
}

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4m0-14v14m9-14v10l-9 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
  ...props
}: EmptyStateProps) {
  return (
    <div className={["empty-state", className].filter(Boolean).join(" ")} {...props}>
      <div className="empty-state-icon">{icon ?? <DefaultIcon />}</div>
      <p className="empty-state-title">{title}</p>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}