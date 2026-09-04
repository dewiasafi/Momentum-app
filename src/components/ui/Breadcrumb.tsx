import { ReactNode } from "react";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** default panah kanan kecil — bisa diganti "/" atau icon lain */
  separator?: ReactNode;
}

function DefaultSeparator() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Breadcrumb({ items, separator }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="breadcrumb-item">
              {isLast ? (
                // Halaman saat ini — teks polos, bukan link, biar user
                // nggak salah klik "balik ke halaman yang lagi dibuka"
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} onClick={item.onClick} className="breadcrumb-link">
                  {item.label}
                </a>
              ) : (
                <button type="button" onClick={item.onClick} className="breadcrumb-link">
                  {item.label}
                </button>
              )}

              {!isLast && (
                <span className="breadcrumb-separator" aria-hidden="true">
                  {separator ?? <DefaultSeparator />}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}