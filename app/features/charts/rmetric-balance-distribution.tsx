import { curveCardinal } from "@visx/curve";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import {
  AnimatedAnnotation,
  AnimatedAreaSeries,
  AnimatedAxis,
  AnnotationConnector,
  AnnotationLabel,
  AnnotationLineSubject,
  XYChart,
  Tooltip,
} from "@visx/xychart";
import { useMemo } from "react";
import mdaoTheme from "./mdao-theme";

type Props = {
  data: Data[];
  userBalance?: number;
};

type Data = {
  address: string;
  balance: number;
};

const accessors = {
  xAccessor: (d: Data) => d.address,
  yAccessor: (d: Data) => d.balance,
};

// Chart with xAxis of user addresses and yAxis of rMetric balance. Optionally, the user's balance is highlighted with an annotation.
export default function RmetricBalanceDistributionChart({ data, userBalance }: Props) {
  return (
    <ParentSize>
      {({ width, height }) => (
        <RmetricBalanceDistributionChartUnwrapped width={width} height={height} data={data} userBalance={userBalance} />
      )}
    </ParentSize>
  );
}

function RmetricBalanceDistributionChartUnwrapped({
  width,
  height,
  data,
  userBalance,
}: { width: number; height: number } & Props) {
  // Insert user info into data and sort by balance
  const { sortedData, userDatum } = useMemo(() => {
    let userDatum;
    if (userBalance) {
      userDatum = { address: "You", balance: userBalance };
      data.push({ address: "You", balance: userBalance });
    }
    const sortedData = data.sort((a, b) => b.balance - a.balance);
    return { sortedData, userDatum };
  }, [data, userBalance]);

  return (
    <XYChart theme={mdaoTheme} height={height} width={width} xScale={{ type: "band" }} yScale={{ type: "linear" }}>
      <AnimatedAreaSeries
        dataKey="rMetricHoldersAreaSeries"
        data={sortedData}
        xAccessor={accessors.xAccessor}
        yAccessor={accessors.yAccessor}
        curve={curveCardinal}
      />
      <AnimatedAxis key="y" orientation="left" numTicks={5} label="rMetric Balance" />
      {userDatum && (
        <AnimatedAnnotation dataKey="rMetricHoldersAreaSeries" datum={userDatum} dx={10} dy={10}>
          <AnnotationLineSubject />
          <AnnotationConnector type="elbow" />
          <AnnotationLabel title="You" subtitle={`${accessors.yAccessor(userDatum)} rMEtric`} showAnchorLine={false} />
        </AnimatedAnnotation>
      )}
      <Tooltip<Data>
        snapTooltipToDatumX
        showVerticalCrosshair
        renderTooltip={({ tooltipData, colorScale }) => (
          <>
            {tooltipData?.nearestDatum && (
              <div>
                <p className="font-extrabold">{accessors.xAccessor(tooltipData.nearestDatum.datum)}</p>
                <p className="text-gray-600">{accessors.yAccessor(tooltipData.nearestDatum.datum)} rMetric</p>
              </div>
            )}
          </>
        )}
      />
    </XYChart>
  );
}
