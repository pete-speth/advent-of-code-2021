const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const lineObjs = utils.parseInputToList(inputFilePath, parseLineObject);

    const floorMap = buildMap(lineObjs);
    const floorMapDiagonals = buildMap(lineObjs, true);

    return [countOverlaps(floorMap), countOverlaps(floorMapDiagonals)];
  },
};

function parseLineObject(s) {
  [x0, y0, x1, y1] = s
    .split("->")
    .flatMap((s) => s.trim().split(","))
    .map((s) => parseInt(s));
  return { x0, y0, x1, y1 };
}

function initArray(height, width, value = 0) {
  let arr = [];
  for (let i = 0; i <= height; i++) {
    let row = [];
    for (let j = 0; j <= width; j++) {
      row.push(0);
    }
    arr.push(row);
  }

  return arr;
}

function buildMap(lineObjs, includeDiagonals = false) {
  // find the size of the map and initialize
  let x_max = 0;
  let y_max = 0;
  lineObjs.forEach((line) => {
    if (line.x0 > x_max) x_max = line.x0;
    if (line.x1 > x_max) x_max = line.x1;
    if (line.y0 > y_max) y_max = line.y0;
    if (line.y1 > y_max) y_max = line.y1;
  });
  let floorMap = initArray(y_max, x_max);

  // draw each line  on the map
  lineObjs.forEach((line) => {
    // optionally exclude diagonal lines
    if (includeDiagonals || line.x0 == line.x1 || line.y0 == line.y1) {
      let x_diff = line.x1 - line.x0;
      let y_diff = line.y1 - line.y0;

      let x = line.x0;
      let y = line.y0;

      // increment x, y, x_diff, y_diff based on line direction
      // moving stepwise from x0 to x1 and y0 to y1
      while (x_diff != 0 || y_diff != 0) {
        floorMap[y][x]++;
        if (x_diff != 0) {
          let inc = x_diff > 0 ? 1 : -1;
          x += inc;
          x_diff -= inc;
        }
        if (y_diff != 0) {
          let inc = y_diff > 0 ? 1 : -1;
          y += inc;
          y_diff -= inc;
        }
      }

      floorMap[y][x]++;
    }
  });

  return floorMap;
}

function countOverlaps(floorMap) {
  let overlaps = 0;
  floorMap
    .flatMap((el) => el)
    .forEach((el) => {
      if (el > 1) overlaps++;
    });
  return overlaps;
}

function printMap(m) {
  console.log(m.map((a) => a.join("")).join("\n"));
}
