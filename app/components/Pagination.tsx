import { ArrowLeft24, ArrowRight24 } from "@carbon/icons-react";
import { useSearchParams } from "@remix-run/react";
import clsx from "clsx";

interface PageButtonProps {
  children?: React.ReactNode;
  page: number;
  isSelected?: boolean;
}

// Component that assumes you are using the `page` query param on your route. Example: route?page=2
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
        <PageButton page={page - 1}>
          <ArrowLeft24 className="text-white" />
        </PageButton>
      )}
      {showFirstPage && (
        <>
          <PageButton page={1} />
          <span>...</span>
        </>
      )}
      {hasPrevious && <PageButton page={page - 1} />}
      <PageButton isSelected={true} page={page} />
      {hasNext && <PageButton page={page + 1} />}
      {showLastPage && (
        <>
          <span>...</span>
          <PageButton page={totalPages} />
        </>
      )}
      {hasNext && (
        <PageButton page={page + 1}>
          <ArrowRight24 className="text-white" />
        </PageButton>
      )}
    </div>
  );
}

function PageButton({ children, page, isSelected }: PageButtonProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = () => {
    let updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set("page", String(page));
    setSearchParams(updatedSearchParams, { replace: true, state: { scroll: false } });
  };

  return (
    <button
      className={clsx("font-inter cursor-pointer text-left text-grayText", { "font-extrabold": isSelected })}
      onClick={handleClick}
    >
      {children ?? page}
    </button>
  );
}
