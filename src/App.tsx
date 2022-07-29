import React, { useState } from "react";
import { Test } from "./Test";
import SliderRange from "./SliderRange";
import { COLORS } from "./colors";

const WIDTH = 756;

const style = { width: 756, margin: 50 };
const TOTAL = 50;
const TECHNOLOGIES = [
  { name: "", label: "SAF", color: COLORS[0].color },
  { name: "", label: "DAC", color: COLORS[1].color },
  { name: "", label: "GH", color: COLORS[2].color },
  { name: "", label: "LDES", color: COLORS[3].color }
];

export default function App() {
  const [ranges, setRanges] = useState([0, 2.65, 2.65, 94.7]);

  return (
    <div className="App">
      {/* <Test /> */}
      {/* <div style={style}> */}
      {/* <p>Multi Range with custom track and handle style and pushable</p> */}

      <SliderRange
        ranges={ranges}
        label={(range, index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transform: "translate(0, -20px)",
                height: 55
              }}
            >
              <div>{TECHNOLOGIES[index].label}</div>
              <div>{(range / 100) * TOTAL}</div>
            </div>
          );
        }}
        colors={TECHNOLOGIES.map((c) => c.color)}
        onRangesChange={setRanges}
        width={WIDTH}
      />
      {/* </div>  */}
    </div>
  );
}
