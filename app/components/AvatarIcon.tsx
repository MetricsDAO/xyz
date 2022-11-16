import * as Avatar from "@radix-ui/react-avatar";

export default function AvatarIcon({
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
    <Avatar.Root className={`w-${size} h-${size}`}>
      <Avatar.Image className="w-full h-full" src={src} alt={alt} />
      <Avatar.Fallback className="w-full h-full" delayMs={delay}>
        {fallback}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
