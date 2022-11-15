import { Paper, Title, Text, Progress } from "@mantine/core";
import { CountDown } from "./CountDown";

export function CountDownCard({ progress, time, subText }: { progress: number; time: string; subText?: string }) {
  return (
    <Paper withBorder>
      <Progress value={progress} radius="xs" />
      <div className="flex flex-col items-center my-6 px-3">
        <Title weight={400}>
          <CountDown date={time} />
        </Title>
        <Text>{subText}</Text>
      </div>
    </Paper>
  );
}
