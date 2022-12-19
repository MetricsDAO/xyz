import clsx from "clsx";

export function Detail({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("flex gap-x-6", className)}>{children}</div>;
}

export function DetailItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-xs text-neutral-500 uppercase">{title}</h4>
      <div>{children}</div>
    </div>
  );
}
