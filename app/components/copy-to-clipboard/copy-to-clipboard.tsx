import clsx from "clsx";
import { useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";
import { Tooltip } from "../tooltip";

export function CopyToClipboard({
  content,
  displayContent,
  className,
  iconRight,
}: {
  content: string;
  displayContent?: string; // Can be set to display a different string than the one that is copied to clipboard
  className?: string;
  iconRight?: React.ReactNode;
}) {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isCopiedTooltip, setIsCopiedTooltip] = useState(false);

  useEffect(() => {
    if (isCopiedTooltip) {
      setTimeout(() => {
        setIsCopiedTooltip(false);
      }, 1000);
    }
  }, [isCopiedTooltip]);

  return (
    <Tooltip content={isCopiedTooltip ? "Copied to clipboard!" : content}>
      <span
        onClick={() => {
          copyToClipboard(content);
          setIsCopiedTooltip(true);
        }}
        className={clsx("flex items-center", className)}
      >
        {displayContent ?? content} {iconRight}
      </span>
    </Tooltip>
  );
}
