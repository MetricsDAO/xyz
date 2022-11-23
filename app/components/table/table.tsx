import { Link } from "@remix-run/react";

import type { RemixLinkProps } from "@remix-run/react/dist/components";
import clsx from "clsx";
import { Card } from "~/components/Card";

// TODO: comment
export function Table({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function Header({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className="hidden text-xs text-gray-500 font-medium lg:grid grid-cols-12 gap-x-1 items-end px-2 lg:mb-3"
      {...props}
    >
      {props.children}
    </div>
  );
}

Header.Column = function HeaderColumn({ ...props }: React.ComponentProps<"div">) {
  return <div {...props}>{props.children}</div>;
};

export function Row(props: RemixLinkProps) {
  return (
    <Card asChild>
      <Link
        // On mobile, two column grid with "labels". On desktop hide the "labels".
        className="grid grid-cols-2 lg:grid-cols-12 gap-y-3 gap-x-1 items-center px-4 py-5 mb-4"
        {...props}
      >
        {props.children}
      </Link>
    </Card>
  );
}

Row.Column = function RowColumn({ label, ...props }: { label: string } & React.ComponentProps<"div">) {
  return (
    <>
      <div className="lg:hidden">{label}</div>
      <div className={clsx("text-sm font-medium", props.className)}>{props.children}</div>
    </>
  );
};
