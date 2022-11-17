import { UserAvatarFilledAlt32 } from "@carbon/icons-react";
import { clsx } from "@mantine/core";
import * as RadixAvatar from "@radix-ui/react-avatar";

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
  const fallBackHeight = size === "lg" ? 64 : size === "md" ? 48 : 32;
  return (
    <RadixAvatar.Root>
      <RadixAvatar.Image
        className={clsx(
          { "w-8 h-8": size === "sm" },
          { "w-12 h-12": size === "md" },
          { "w-16 h-16": size === "lg" },
          "rounded-full"
        )}
        src={src}
        alt={alt}
      />
      <RadixAvatar.Fallback delayMs={delay ?? 500}>
        {fallback ?? <UserAvatarFilledAlt32 height={fallBackHeight} width={fallBackHeight} />}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
