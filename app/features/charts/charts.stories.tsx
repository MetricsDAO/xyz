import { fakeRMetricDistributionData } from "~/utils/fakes";
import RmetricBalanceDistributionChart from "./rmetric-balance-distribution";

export function RMetricBalanceDistributionChartExample() {
  const data = fakeRMetricDistributionData();
  return (
    <div className="h-60">
      <RmetricBalanceDistributionChart data={data} userBalance={522} />;
    </div>
  );
}
