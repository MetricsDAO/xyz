import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link } from "@remix-run/react";

export function Breadcrumbs({ crumbs }: { crumbs: { link: string; name: string }[] }) {
  if (crumbs.length < 1) {
    return <></>;
  }

  if (crumbs.length === 1) {
    return (
      <div className="flex gap-3.5 text-stone-500 pb-12 items-center">
        <ChevronLeftIcon className="h-4 w-4" />
        <Link className="text-sm" to={crumbs[0]?.link ?? ""}>
          {crumbs[0]?.name}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-3.5 text-stone-500 pb-12 items-center">
      <Link className="text-sm" to={crumbs[0]?.link ?? ""}>
        {crumbs[0]?.name}
      </Link>
      {crumbs.slice(1).map((crumb) => (
        <>
          <ChevronRightIcon className="h-4 w-4" />
          <Link className="text-sm" to={crumb.link}>
            {crumb.name}
          </Link>
        </>
      ))}
    </div>
  );
}
