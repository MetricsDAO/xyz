export function Detail({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

Detail.Title = function DetailTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs text-[#666666] uppercase">{children}</p>;
};
