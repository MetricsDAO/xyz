import { Text } from "@mantine/core";

export function Detail({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

Detail.Title = function DetailTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text size="xs" color="gray" weight={500} transform="uppercase" className="mb-2">
      {children}
    </Text>
  );
};
