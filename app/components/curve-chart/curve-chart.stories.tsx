import { CurveChart } from "./curve-chart";

export const Index = () => {
  return (
    <div className="space-y-10">
      <h3>Default - Constant</h3>
      <CurveChart type="Constant" />
      <h3>400 SOL - Aggressive</h3>
      <CurveChart type="Aggresive" amount={"400"} token="SOL" />
      <h3>25 SOL - Acceptable</h3>
      <CurveChart type="Acceptable" amount={"25"} token="SOL" />
      <h3>400 SOL - Pass / Fail</h3>
      <CurveChart type="Pass / Fail" amount={"400"} token="SOL" />
    </div>
  );
};
