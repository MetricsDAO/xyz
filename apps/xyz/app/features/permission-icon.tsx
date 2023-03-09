import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";

export function PermissionIcon({ isAllowed }: { isAllowed?: boolean }) {
  if (isAllowed === undefined) {
    return null;
  }

  if (isAllowed) {
    return <CheckCircleIcon className="w-5 h-5 text-lime-600" />;
  }

  return <XCircleIcon className="w-5 h-5 text-rose-500" />;
}
