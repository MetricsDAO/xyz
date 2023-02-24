import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link } from "@remix-run/react";

export function Breadcrumbs({ crumbs }: { crumbs: { link: string; name: string }[] }) {
  if (crumbs.length < 1) {
    return <></>;
  }

  if (crumbs.length === 1) {
    return (
      <div className="flex gap-1 text-stone-500 pb-11 items-center">
        <ChevronLeftIcon className="h-4 w-4" />
        <Link className="text-sm p-2.5 hover:bg-gray-800 hover:bg-opacity-5 rounded" to={crumbs[0]?.link ?? ""}>
          {crumbs[0]?.name}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-1 text-stone-500 pb-11 items-center">
      <Link className="text-sm p-2.5 hover:bg-gray-800 hover:bg-opacity-5 rounded" to={crumbs[0]?.link ?? ""}>
        {crumbs[0]?.name}
      </Link>
      {crumbs.slice(1).map((crumb) => (
        <>
          <ChevronRightIcon className="h-4 w-4" />
          <Link className="text-sm p-2.5 hover:bg-gray-800 hover:bg-opacity-5 rounded" to={crumb.link}>
            {crumb.name}
          </Link>
        </>
      ))}
    </div>
  );
}
