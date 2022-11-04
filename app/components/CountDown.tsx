import { Paper, Title, Text, Progress } from "@mantine/core";

export function CountDown({ progress, time, subText }: { progress: number; time: string; subText?: string }) {
  return (
    <Paper withBorder>
      <Progress value={progress} radius="xs" />
      <div className="flex flex-col items-center my-6 px-3">
        <Title weight={400}>{time}</Title>
        <Text>{subText}</Text>
      </div>
    </Paper>
  );
}
