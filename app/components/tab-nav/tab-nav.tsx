import type { NavLinkProps } from "@remix-run/react";
import { NavLink } from "@remix-run/react";
import clsx from "clsx";

export function TabNav({ children, className }: { children: React.ReactNode; className?: string }) {
  const classes = clsx("border-b border-gray-300/50 flex space-x-4", className);
  return <nav className={classes}>{children}</nav>;
}

export function TabNavLink({ children, ...props }: NavLinkProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        clsx("border-b py-4 px-2 text-sm text-medium -mb-[1px]", {
          "border-transpaprent text-gray-700": !isActive,
          "border-b border-sky-500 text-sky-500": isActive,
        })
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}
