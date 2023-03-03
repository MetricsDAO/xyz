import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export function PermissionIcon({ isAllowed }: { isAllowed?: boolean }) {
  return (
    <>
      <CheckCircleIcon
        className={clsx("w-5 h-5 text-lime-600", {
          hidden: isAllowed === undefined || isAllowed === false,
        })}
      />
      <XCircleIcon
        className={clsx("w-5 h-5 text-rose-500", {
          hidden: isAllowed === undefined || isAllowed === true,
        })}
      />
    </>
  );
}
