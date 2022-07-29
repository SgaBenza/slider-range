import "./styles.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { CSSProperties, useState } from "react";
import { take, range, round } from "lodash";
import { scaleLinear } from "d3";

const RAIL_HEIGHT = 14;
const HANDLER_DIAMETER = 20;
const RANGE = [0, 100];
const INTIAL_VALUES = [25, 50, 75];

const COUNT = 2;

const singleHandleStyle = () => {
  const marginTop = ((HANDLER_DIAMETER - RAIL_HEIGHT) / 2) * -1;
  return {
    opacity: 1,
    height: HANDLER_DIAMETER,
    width: HANDLER_DIAMETER,
    marginTop,
    borderColor: "#3EF08F"
  } as CSSProperties;
};
const handleStyle = range(COUNT + 1).map(() => singleHandleStyle());

function map2<T, U>(
  array: T[],
  mapper: (current: T, next: T, index: number, array: T[]) => U
): U[] {
  return array.slice(1).map((next, i) => mapper(array[i], next, i, array));
}

function scaledRange(n: number, domain: [number, number]) {
  const scale = scaleLinear(domain, [0, 100]);
  const scaledRange = scale(n);
  const roundedScaledRange = round(scaledRange, 2);
  return roundedScaledRange;
}

function positionsAddPushable(positions: number[], pushable: number) {
  const firstRange = round(
    scaledRange(positions[0], [0, 100 - 2 * pushable]),
    2
  );
  const lastRange = round(
    scaledRange(100 - positions[positions.length - 1], [0, 100 - 2 * pushable]),
    2
  );
  const middleRanges = map2(
    positions.map((p) => scaledRange(p, [pushable, 100 - 2 * pushable])),
    (curr, next) => round(next - curr - pushable, 2)
  );
  return [firstRange, ...middleRanges, lastRange];
}

interface SliderRangeProps {
  ranges: number[];
  colors: string[];
  onRangesChange: (ranges: number[]) => void;
  label: (range: number, index: number) => JSX.Element | string;
  width: number;
}

const rangesToPositions = (ranges: number[]) =>
  take<number>(
    ranges.reduce((acc: number[], curr, i) => {
      return i === 0 ? [curr] : [...acc, curr + acc[i - 1]];
    }, []),
    3
  );

const positionsToRanges = (positions: number[]) => {
  return [
    positions[0] - RANGE[0],
    positions[1] - positions[0],
    positions[2] - positions[1],
    RANGE[1] - positions[2]
  ];
};

export default function SliderRange({
  ranges,
  label,
  colors,
  width,
  onRangesChange
}: SliderRangeProps) {
  const trackStyle = colors.slice(1).map((c) => ({
    backgroundColor: c,
    height: RAIL_HEIGHT
  }));

  const pushable = round((HANDLER_DIAMETER / width) * (RANGE[1] - RANGE[0]), 2);

  return (
    <div>
      <div style={{ display: "flex" }}>RANGES: </div>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "0 10px" }}>{ranges[0]}</div>
        <div style={{ margin: "0 10px" }}>{ranges[1]}</div>
        <div style={{ margin: "0 10px" }}>{ranges[2]}</div>
        <div style={{ margin: "0 10px" }}>{ranges[3]}</div>
      </div>
      <div style={{ display: "flex" }}>POSITIONS: </div>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "0 10px" }}>{rangesToPositions(ranges)[0]}</div>
        <div style={{ margin: "0 10px" }}>{rangesToPositions(ranges)[1]}</div>
        <div style={{ margin: "0 10px" }}>{rangesToPositions(ranges)[2]}</div>
      </div>
      <div style={{ display: "flex" }}>NEW RANGES: </div>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "0 10px" }}>
          {positionsToRanges(rangesToPositions(ranges))[0]}
        </div>
        <div style={{ margin: "0 10px" }}>
          {positionsToRanges(rangesToPositions(ranges))[1]}
        </div>
        <div style={{ margin: "0 10px" }}>
          {positionsToRanges(rangesToPositions(ranges))[2]}
        </div>
        <div style={{ margin: "0 10px" }}>
          {positionsToRanges(rangesToPositions(ranges))[3]}
        </div>
      </div>
      {/* <div style={{ display: "flex" }}>PUSHABLE: {pushable}</div>
      <div style={{ display: "flex" }}>POSITIONS ADD PUSHABLE: </div>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "0 10px" }}>
          {positionsAddPushable(rangesToPositions(ranges), pushable)[0]}
        </div>
        <div style={{ margin: "0 10px" }}>
          {positionsAddPushable(rangesToPositions(ranges), pushable)[1]}
        </div>
        <div style={{ margin: "0 10px" }}>
          {positionsAddPushable(rangesToPositions(ranges), pushable)[2]}
        </div>
      </div> */}
      <Slider
        range
        style={{ width, margin: 20 }}
        count={ranges.length - 2}
        min={RANGE[0]}
        max={RANGE[1]}
        value={rangesToPositions(ranges)}
        pushable={pushable}
        step={0.01}
        trackStyle={trackStyle}
        handleStyle={handleStyle}
        railStyle={{
          background: `linear-gradient(to right, ${colors[0]} ${ranges[0]}%, ${
            colors[colors.length - 1]
          } ${ranges[0]}%)`,
          height: RAIL_HEIGHT
        }}
        onChange={
          ((d: number[]) => {
            const newRanges = positionsToRanges(d);

            onRangesChange(newRanges);

            // onRangesChange(
            //   positionsToRanges(d).map((p) => {
            //     const scale = scaleLinear(
            //       [RANGE[0], RANGE[1] - pushable * (ranges.length - 1)],
            //       RANGE
            //     );

            //     return round(scale(p), 2);
            //   })
            // );
          }) as any
        }
        // marks={{
        //   [ranges[0]]: {
        //     label: (
        //       <div
        //         style={{
        //           transform: `translate(0px, ${-RAIL_HEIGHT}px)`,
        //           pointerEvents: "none"
        //         }}
        //       >
        //         {label(ranges[0], 0)}
        //       </div>
        //     ),
        //     style: { color: "red" }
        //   }
        // }}
        dotStyle={{ display: "none" }}
      />
    </div>
  );
}
