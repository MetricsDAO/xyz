import { ArrowSmallRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

type Variant = "primary" | "outline";

export default function MarketingButton({
  label,
  link,
  variant = "primary",
}: {
  label: string;
  link: string;
  variant?: Variant;
}) {
  return (
    <a
      className={clsx("border-2 rounded-lg w-fit h-10 flex items-center justify-start", {
        "border-sky-500": variant === "primary",
        "border-white": variant === "outline",
      })}
      href={link}
    >
      <div
        className={clsx("rounded-lg h-10 px-4 flex items-center", {
          "text-white bg-sky-500": variant === "primary",
          "text-sky-500 bg-white": variant === "outline",
        })}
      >
        <p>{label}</p>
      </div>
      <ArrowSmallRightIcon
        className={clsx("px-1 h-9 w-9", {
          "text-sky-500": variant === "primary",
          "text-white": variant === "outline",
        })}
      />
    </a>
  );
}
