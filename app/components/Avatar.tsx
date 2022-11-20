import * as RadixAvatar from "@radix-ui/react-avatar";
import clsx from "clsx";

type Props = {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
};

const sizeStyles = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-8 h-8",
};

export default function Avatar({ src, alt, size = "md" }: Props) {
  const classes = clsx("inline-block rounded-full bg-neutral-300", sizeStyles[size]);
  return (
    <RadixAvatar.Root className={classes}>
      <RadixAvatar.Image className="w-full h-full" src={src} alt={alt} />
      <RadixAvatar.Fallback
        className="w-full h-full flex items-center justify-center"
        delayMs={500}
      ></RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
