import { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

export type SortDirection = "asc" | "desc" | null;

// ---------------------------------------------------------------
// Table — wrapper scroll + <table>
// ---------------------------------------------------------------
export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

function Table({ children, className = "", ...props }: TableProps) {
  return (
    <div className="table-wrapper">
      <table className={["table", className].filter(Boolean).join(" ")} {...props}>
        {children}
      </table>
    </div>
  );
}

// ---------------------------------------------------------------
// Table.Head — <thead>
// ---------------------------------------------------------------
function TableHead({ children, className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={["table-head", className].filter(Boolean).join(" ")} {...props}>
      <tr>{children}</tr>
    </thead>
  );
}

// ---------------------------------------------------------------
// Table.HeaderCell — <th>, opsional sortable
// ---------------------------------------------------------------
export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  /** kalau diisi, header ini jadi bisa diklik buat sorting */
  sortDirection?: SortDirection;
  onSort?: () => void;
}

function TableHeaderCell({ children, sortDirection, onSort, className = "", ...props }: TableHeaderCellProps) {
  const isSortable = Boolean(onSort);
  const classes = ["table-header-cell", isSortable ? "table-header-cell-sortable" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <th
      scope="col"
      className={classes}
      onClick={onSort}
      aria-sort={
        sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : undefined
      }
      {...props}
    >
      {children}
      {isSortable && (
        <span
          className={["table-sort-icon", sortDirection ? "table-sort-icon-active" : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {sortDirection === "asc" ? "▲" : sortDirection === "desc" ? "▼" : "⇅"}
        </span>
      )}
    </th>
  );
}

// ---------------------------------------------------------------
// Table.Body — <tbody>
// ---------------------------------------------------------------
function TableBody({ children, className = "", ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

// ---------------------------------------------------------------
// Table.Row — <tr>
// ---------------------------------------------------------------
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  hoverable?: boolean;
  striped?: boolean;
}

function TableRow({ children, hoverable = true, striped = false, className = "", ...props }: TableRowProps) {
  const classes = [
    "table-body-row",
    hoverable ? "table-body-row-hoverable" : "",
    striped ? "table-body-row-striped" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr className={classes} {...props}>
      {children}
    </tr>
  );
}

// ---------------------------------------------------------------
// Table.Cell — <td>
// ---------------------------------------------------------------
function TableCell({ children, className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={["table-cell", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </td>
  );
}

Table.Head = TableHead;
Table.HeaderCell = TableHeaderCell;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;