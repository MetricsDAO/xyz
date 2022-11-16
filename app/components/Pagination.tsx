import { ArrowLeft24, ArrowRight24 } from "@carbon/icons-react";
import { Link, useSearchParams } from "@remix-run/react";

interface PageButtonProps {
  children?: React.ReactNode;
  page: number;
  isSelected?: boolean;
}

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages === 1) {
    return null;
  }

  const hasPrevious = page - 1 > 0;
  const hasNext = page + 1 <= totalPages;
  const showFirstPage = page - 2 > 0;
  const showLastPage = page + 2 <= totalPages;

  return (
    <div className="flex justify-center space-x-5 items-center">
      {hasPrevious && (
        <PageLink page={page - 1}>
          <ArrowLeft24 />
        </PageLink>
      )}
      {showFirstPage && (
        <>
          <PageLink page={1} />
          <span>...</span>
        </>
      )}
      {hasPrevious && <PageLink page={page - 1} />}
      <PageLink isSelected={true} page={page} />
      {hasNext && <PageLink page={page + 1} />}
      {showLastPage && (
        <>
          <span>...</span>
          <PageLink page={totalPages} />
        </>
      )}
      {hasNext && (
        <PageLink page={page + 1}>
          <ArrowRight24 />
        </PageLink>
      )}
    </div>
  );
}

function PageLink({ children, page, isSelected }: PageButtonProps) {
  const [searchParams] = useSearchParams();
  searchParams.set("page", String(page));

  return (
    <Link
      to={`?${searchParams.toString()}`}
      className={`font-inter cursor-pointer text-left ${isSelected ? "font-extrabold" : "text-grayText"}`}
    >
      {children ?? page}
    </Link>
  );
}
