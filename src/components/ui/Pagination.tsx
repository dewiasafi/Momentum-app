import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  className = "",
}) => {
  // Helper untuk menghasilkan daftar halaman dengan titik-titik (...)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, maxPagesToShow);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - maxPagesToShow + 1);
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={["pagination-wrapper", className].filter(Boolean).join(" ")}>
      {/* Informasi Halaman */}
      {showInfo && (
        <div className="pagination-info">
          Menampilkan halaman <span className="font-semibold">{currentPage}</span> dari{" "}
          <span className="font-semibold">{totalPages}</span>
        </div>
      )}

      {/* Navigasi Nomor Halaman */}
      <div className="pagination-nav">
        {/* Tombol Sebelumnya (<) */}
        <button
          type="button"
          className="pagination-item"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Halaman Sebelumnya"
        >
          &lt;
        </button>

        {/* Daftar Halaman / Angka */}
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              className={[
                "pagination-item",
                isActive ? "pagination-item-active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Tombol Selanjutnya (>) */}
        <button
          type="button"
          className="pagination-item"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Halaman Selanjutnya"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;