import { Slot } from "@radix-ui/react-slot";

import clsx from "clsx";
import { Card } from "~/components/card/card";

const ColumnSizes = {
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const ColSpans = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
};

type ColumnSize = 6 | 12;
type ColSpan = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * "table" of cards with a header. Choose between 6 and 12 columns. Up to the user to ensure headers and columns line up.
 */
export function Table({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function Header({ columns, ...props }: { columns: ColumnSize } & React.ComponentProps<"div">) {
  return (
    <div className={clsx("grid gap-x-1 items-end px-4", ColumnSizes[columns], props.className)}>{props.children}</div>
  );
}

Header.Column = function HeaderColumn({ span = 1, ...props }: { span?: ColSpan } & React.ComponentProps<"div">) {
  return (
    <div className={clsx(ColSpans[span], props.className)} {...props}>
      {props.children}
    </div>
  );
};

export function Row({
  columns,
  asChild,
  className,
  ...props
}: {
  columns: ColumnSize;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const Comp = asChild ? Slot : "div";
  return (
    <Card asChild={true}>
      <Comp
        {...props}
        className={clsx("grid gap-y-3 gap-x-1 items-center px-4 py-5 mb-4", ColumnSizes[columns], className)}
      />
    </Card>
  );
}

Row.Column = function RowColumn({ span = 1, ...props }: { span?: ColSpan } & React.ComponentProps<"div">) {
  return <div className={clsx(ColSpans[span], props.className)}>{props.children}</div>;
};
