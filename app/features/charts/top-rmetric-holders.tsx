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
import mdaoTheme from "./mdaoTheme";

type Props = {
  userBalance: number;
};

type Data = {
  percentile: string;
  y: number;
};

// bell curve data (probably) of rMetric balances
const data = [
  { percentile: "1", y: 1 },
  { percentile: "10", y: 10 },
  { percentile: "35", y: 40 },
  { percentile: "50", y: 200 },
  { percentile: "65", y: 40 },
  { percentile: "90", y: 10 },
  { percentile: "99", y: 2 },
];

const accessors = {
  xAccessor: (d: Data) => d.percentile,
  yAccessor: (d: Data) => d.y,
};

export default function RmetricBalanceDistributionChart({ userBalance }: Props) {
  return (
    <ParentSize>
      {({ width, height }) => (
        <RmetricBalanceDistributionChartUnwrapped width={width} height={height} userBalance={userBalance} />
      )}
    </ParentSize>
  );
}

function RmetricBalanceDistributionChartUnwrapped({
  width,
  height,
  userBalance,
}: { width: number; height: number } & Props) {
  const annotationDatum = useMemo(() => {
    return data.find((d) => d.y >= userBalance);
  }, [userBalance]);

  return (
    <XYChart theme={mdaoTheme} height={height} width={width} xScale={{ type: "band" }} yScale={{ type: "linear" }}>
      <AnimatedAreaSeries
        dataKey="rMetricHoldersAreaSeries"
        data={data}
        xAccessor={accessors.xAccessor}
        yAccessor={accessors.yAccessor}
        curve={curveCardinal}
      />
      <AnimatedAxis key="percentile" orientation="bottom" label="Percentile" />
      <AnimatedAxis key="y" orientation="left" numTicks={5} label="Number of Users" />
      {annotationDatum && (
        <AnimatedAnnotation dataKey="rMetricHoldersAreaSeries" datum={annotationDatum} dx={10} dy={10}>
          <AnnotationLineSubject />
          <AnnotationConnector type="elbow" />
          <AnnotationLabel
            title={`${annotationDatum.percentile}th percentile`}
            subtitle={`more details of your score`}
            showAnchorLine={false}
          />
        </AnimatedAnnotation>
      )}
      <Tooltip<Data>
        snapTooltipToDatumX
        showVerticalCrosshair
        renderTooltip={({ tooltipData, colorScale }) => (
          <>
            {tooltipData?.nearestDatum && (
              <div>
                {tooltipData.nearestDatum.datum.percentile}th Percentile{": "}
                Balance of {tooltipData.nearestDatum.datum.y}
              </div>
            )}
          </>
        )}
      />
    </XYChart>
  );
}
