import { UserCircleIcon } from "@heroicons/react/20/solid";
import * as RadixAvatar from "@radix-ui/react-avatar";
import clsx from "clsx";

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

export default function Avatar({
  src,
  alt,
  size = "md",
  delay,
  fallback,
}: {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
  fallback?: React.ReactNode;
}) {
  return (
    <RadixAvatar.Root>
      <RadixAvatar.Image className={clsx(sizeClasses[size], "rounded-full")} src={src} alt={alt} />
      <RadixAvatar.Fallback delayMs={delay ?? 500}>
        {fallback ?? <UserCircleIcon className={clsx(sizeClasses[size])} />}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
