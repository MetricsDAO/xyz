import { Title } from "@mantine/core";

export function Detail({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

Detail.Title = function DetailTitle({ children }: { children: React.ReactNode }) {
  return (
    <Title size="h6" color="gray" className="text-xs uppercase font-normal mb-2">
      {children}
    </Title>
  );
};
