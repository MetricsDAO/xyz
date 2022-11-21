import { CountdownCard } from "./countdown-card";

export const Index = () => {
  return (
    <div className="space-y-10">
      <h3>Basic</h3>
      <CountdownCard start={new Date().toString()} />
      <h3>With content</h3>
      <CountdownCard start={new Date().toString()}>some text here</CountdownCard>
    </div>
  );
};
