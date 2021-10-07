import { autoType } from "d3-dsv";
const file = `

type: DATA_1
title: Sample data
description: Please: enter some data
min: 0
max: 5
step: 1
--- 
type: DATA_2
title:  Some other data

min: 0
step: 0.1
`;

const parse = (config) => {
  return config
    .split(/\n--- \s*\n/g)
    .map((chunk) =>
      chunk
        .split("\n")
        .filter((row) => row.trim())
        .map((row) => {
          return row.split(/:\s*(.+)/).filter((r) => r);
        })
    )
    .map((chunk) => autoType(Object.fromEntries(chunk)));
};

console.log(parse(file));
