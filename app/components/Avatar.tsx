import * as RadixAvatar from "@radix-ui/react-avatar";

export default function Avatar({
  src,
  alt,
  size,
  delay,
  fallback,
}: {
  src: string;
  alt: string;
  size: number;
  delay?: number;
  fallback?: React.ReactNode;
}) {
  return (
    <RadixAvatar.Root className={`w-${size} h-${size}`}>
      <RadixAvatar.Image className="w-full h-full" src={src} alt={alt} />
      <RadixAvatar.Fallback className="w-full h-full" delayMs={delay}>
        {fallback}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
