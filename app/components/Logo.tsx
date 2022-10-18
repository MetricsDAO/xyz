import clsx from "clsx";

export function LogoType({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1 className={clsx("font-bold", className)} {...props}>
      MetricsDAO
    </h1>
  );
}

export function LogoMark(props: React.ComponentProps<"img">) {
  return <img src="/img/color-mark@2x.png" alt="MetricsDAO" width="24" height="24" className="tw-mr-2" {...props} />;
}
