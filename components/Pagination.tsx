import Link from "next/link";
import { buildPageNumbers, cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pathname: string;
  searchParams?: Record<string, string | undefined>;
};

export function Pagination({
  currentPage,
  totalPages,
  pathname,
  searchParams = {}
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPageNumbers(currentPage, totalPages);

  function buildHref(page: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        className={cn(
          "rounded-md border px-4 py-2 text-sm transition",
          currentPage === 1
            ? "pointer-events-none border-border text-muted"
            : "border-border bg-white text-foreground hover:border-accent hover:text-accent"
        )}
      >
        السابق
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={cn(
            "rounded-md border px-4 py-2 text-sm transition",
            currentPage === page
              ? "border-accent bg-accent text-white"
              : "border-border bg-white text-foreground hover:border-accent hover:text-accent"
          )}
        >
          {page}
        </Link>
      ))}
      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        className={cn(
          "rounded-md border px-4 py-2 text-sm transition",
          currentPage === totalPages
            ? "pointer-events-none border-border text-muted"
            : "border-border bg-white text-foreground hover:border-accent hover:text-accent"
        )}
      >
        التالي
      </Link>
    </div>
  );
}
