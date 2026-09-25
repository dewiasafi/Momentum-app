import { ReactNode, HTMLAttributes, CSSProperties } from "react";

const ELLIPSIS = "ellipsis" as const;
type PageItem = number | typeof ELLIPSIS;

function getPageRange(currentPage: number, totalPages: number, siblingCount: number): PageItem[] {
  const totalNumbersShown = siblingCount * 2 + 5;

  if (totalPages <= totalNumbersShown) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
    return [...leftRange, ELLIPSIS, totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRangeLength = 3 + siblingCount * 2;
    const rightRange = Array.from({ length: rightRangeLength }, (_, i) => totalPages - rightRangeLength + i + 1);
    return [1, ELLIPSIS, ...rightRange];
  }

  const middleRange = Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i);
  return [1, ELLIPSIS, ...middleRange, ELLIPSIS, totalPages];
}

export type SortDirection = "asc" | "desc" | null;

export interface ColumnType<T> {
  title: ReactNode;
  dataIndex?: keyof T | string;
  key: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
  className?: string;
}

export interface TablePaginationConfig {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  totalItems?: number;
  pageSize?: number;
}

export interface TableProps<T> extends Omit<HTMLAttributes<HTMLTableElement>, "children"> {
  dataSource: T[];
  columns: ColumnType<T>[];
  rowKey: keyof T | ((record: T) => string | number);
  loading?: boolean;
  emptyText?: ReactNode;
  sortColumn?: string | null;
  sortDirection?: SortDirection;
  onSortChange?: (columnKey: string, direction: SortDirection) => void;
  hoverable?: boolean;
  striped?: boolean;
  pagination?: TablePaginationConfig | false;
  /** Tambahan props untuk kustomisasi warna header */
  headerClassName?: string;
  headerStyle?: CSSProperties;
}

export function Table<T>({
  dataSource,
  columns,
  rowKey,
  loading = false,
  emptyText = "Tidak ada data",
  sortColumn,
  sortDirection,
  onSortChange,
  hoverable = true,
  striped = false,
  pagination,
  headerClassName = "",
  headerStyle,
  className = "",
  ...props
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return (record[rowKey] as unknown as string | number) ?? index;
  };

  const handleSort = (column: ColumnType<T>) => {
    if (!column.sortable || !onSortChange) return;

    let nextDirection: SortDirection = "asc";
    if (sortColumn === column.key) {
      if (sortDirection === "asc") nextDirection = "desc";
      else if (sortDirection === "desc") nextDirection = null;
      else nextDirection = "asc";
    }

    onSortChange(column.key, nextDirection);
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <table className={["table", className].filter(Boolean).join(" ")} {...props}>
         <thead 
            className={["table-head", headerClassName].filter(Boolean).join(" ")}
            style={headerStyle}
          >
            <tr>
              {columns.map((col) => {
                const isCurrentSort = sortColumn === col.key;
                const isSortable = Boolean(col.sortable);
                const align = col.align ? alignClasses[col.align] : "text-left";

                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width }}
                    className={[
                      "table-header-cell",
                      isSortable ? "table-header-cell-sortable" : "",
                      align,
                      col.className || "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleSort(col)}
                    aria-sort={
                      isCurrentSort && sortDirection === "asc"
                        ? "ascending"
                        : isCurrentSort && sortDirection === "desc"
                        ? "descending"
                        : undefined
                    }
                  >
                    {/* Bungkus konten header agar mewarisi warna teks dengan sempurna */}
                    <div className={`inline-flex items-center gap-1.5 w-full text-inherit ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : "justify-start"}`}>
                      <span className="text-inherit">{col.title}</span>
                      {isSortable && (
                        <span
                          className={[
                            "table-sort-icon",
                            isCurrentSort && sortDirection ? "table-sort-icon-active" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {isCurrentSort && sortDirection === "asc"
                            ? "▲"
                            : isCurrentSort && sortDirection === "desc"
                            ? "▼"
                            : "⇅"}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="table-body">
            {loading ? (
              <tr className="table-body-row">
                <td colSpan={columns.length} className="px-6 py-12 text-center text-momentum-neutral-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-momentum-500 border-t-transparent" />
                    <span>Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : dataSource.length === 0 ? (
              <tr className="table-body-row">
                <td colSpan={columns.length} className="px-6 py-12 text-center text-momentum-neutral-500">
                  {emptyText}
                </td>
              </tr>
            ) : (
              dataSource.map((record, index) => {
                const key = getRowKey(record, index);
                const rowClasses = [
                  "table-body-row",
                  hoverable ? "table-body-row-hoverable" : "",
                  striped && index % 2 === 1 ? "table-body-row-striped" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <tr key={key} className={rowClasses}>
                    {columns.map((col) => {
                      const val = col.dataIndex ? (record as any)[col.dataIndex] : undefined;
                      const cellContent = col.render ? col.render(val, record, index) : val;
                      const cellAlign = col.align ? alignClasses[col.align] : "text-left";

                      return (
                        <td
                          key={col.key}
                          className={["table-cell", cellAlign, col.className || ""]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination-info">
            {pagination.currentPage && (
              <span>
                Halaman <strong className="text-momentum-neutral-800">{pagination.currentPage}</strong> dari{" "}
                <strong className="text-momentum-neutral-800">{pagination.totalPages}</strong>
              </span>
            )}
          </div>

          <nav aria-label="Pagination" className="pagination-nav">
            <button
              type="button"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              aria-label="Halaman sebelumnya"
              className="pagination-item"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {getPageRange(pagination.currentPage, pagination.totalPages, pagination.siblingCount ?? 1).map((page, index) =>
              page === ELLIPSIS ? (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  aria-current={page === pagination.currentPage ? "page" : undefined}
                  onClick={() => pagination.onPageChange(page as number)}
                  className={[
                    "pagination-item",
                    page === pagination.currentPage ? "pagination-item-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              aria-label="Halaman berikutnya"
              className="pagination-item"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

export default Table;