import * as RadixAvatar from "@radix-ui/react-avatar";
import clsx from "clsx";

type Props = {
  src?: string;
  size?: "sm" | "md" | "lg";
  alt?: string;
  fallback?: React.ReactNode;
};

const sizeStyles = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-8 h-8",
};

export function Avatar({ src, alt, fallback, size = "md" }: Props) {
  const classes = clsx("inline-block rounded-full bg-neutral-300 overflow-hidden", sizeStyles[size]);
  return (
    <RadixAvatar.Root className={classes}>
      <RadixAvatar.Image className="w-full h-full" src={src} alt={alt ?? "avatar"} />
      <RadixAvatar.Fallback className="w-full h-full flex items-center justify-center" delayMs={500}>
        {fallback}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}

Avatar.Group = function AvatarGroup({ children }: { children: React.ReactNode }) {
  const classes = clsx("-space-x-3 flex items-center");
  return <div className={classes}>{children}</div>;
};
