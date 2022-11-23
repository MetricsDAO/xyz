import { Link } from "@remix-run/react";

import type { RemixLinkProps } from "@remix-run/react/dist/components";
import clsx from "clsx";
import { Card } from "~/components/Card";

const ColumnSizes = {
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const ColSpans = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
};

type ColumnSize = 6 | 12;
type ColSpan = 1 | 2 | 3 | 4;

/**
 * Responsive "table" that collapses into a card on mobile. Choose between 6 and 12 columns. Up to the user to ensure headers and columns line up.
 */
export function Table({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function Header({ columns, ...props }: { columns: ColumnSize } & React.ComponentProps<"div">) {
  return (
    <div
      className={clsx(
        "hidden text-xs text-gray-500 font-medium lg:grid gap-x-1 items-end px-2 lg:mb-3",
        ColumnSizes[columns],
        props.className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
}

Header.Column = function HeaderColumn({ span = 1, ...props }: { span?: ColSpan } & React.ComponentProps<"div">) {
  return (
    <div className={clsx(ColSpans[span], props.className)} {...props}>
      {props.children}
    </div>
  );
};

export function Row({ columns, ...props }: { columns: ColumnSize } & RemixLinkProps) {
  return (
    <Card asChild>
      <Link
        // On mobile, two column grid with labels.
        className={clsx(
          "grid grid-cols-2 gap-y-3 gap-x-1 items-center px-4 py-5 mb-4",
          `lg:${ColumnSizes[columns]}`,
          props.className
        )}
        {...props}
      >
        {props.children}
      </Link>
    </Card>
  );
}

Row.Column = function RowColumn({
  label,
  span = 1,
  ...props
}: { label: string; span?: ColSpan } & React.ComponentProps<"div">) {
  return (
    <>
      {/* The label in the first grid column on mobile. On desktop (lg) hide the labels. */}
      <div className="lg:hidden">{label}</div>
      <div className={clsx("text-sm font-medium", `lg:${ColSpans[span]}`, props.className)}>{props.children}</div>
    </>
  );
};
