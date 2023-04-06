import { faker } from "@faker-js/faker";
import RmetricBalanceDistributionChart from "./rmetric-balance-distribution";

const fakeRMetricDistributionData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      address: faker.finance.ethereumAddress(),
      balance: faker.datatype.number({ min: 0, max: 1000 }),
    });
  }
  return data;
};

export function RMetricBalanceDistributionChartExample() {
  const data = fakeRMetricDistributionData();
  return (
    <div className="h-60">
      <RmetricBalanceDistributionChart data={data} userBalance={522} />;
    </div>
  );
}
