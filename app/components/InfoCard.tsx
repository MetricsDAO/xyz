import { Paper, Title } from "@mantine/core";
import clsx from "clsx";

export function InfoCard({ className, children }: { children: React.ReactNode; className?: string }) {
  const classes = clsx("flex flex-col space-y-3 rounded-lg p-6", className);
  return (
    <Paper withBorder className={classes}>
      {children}
    </Paper>
  );
}

InfoCard.Title = function Info({ children }: { children: React.ReactNode }) {
  return <Title size="h5">{children}</Title>;
};
