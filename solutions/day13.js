const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const lines = utils.parseInputToLines(inputFilePath);

    const sectionSplit = lines.findIndex((el) => !el);
    const points = parsePoints(lines.slice(0, sectionSplit));
    const folds = parseFolds(lines.slice(sectionSplit + 1));

    const arr = buildArray(points);
    console.log(countPoints(foldArray(arr, folds[0])));

    let foldedArr = arr;
    folds.forEach((fold) => {
      foldedArr = foldArray(foldedArr, fold);
    });

    printArray(foldedArr);
  },
};

function parsePoints(lines) {
  return lines.map((s) => {
    [x, y] = s.split(",").map((i) => parseInt(i));
    return { x, y };
  });
}

function parseFolds(lines) {
  return lines.map((s) => {
    let terms = s.split(" ");
    [axis, value] = terms[2].split("=");
    return { axis, value };
  });
}

function buildArray(points) {
  let xMax = 0;
  let yMax = 0;
  points.forEach((p) => {
    if (p.x > xMax) xMax = p.x;
    if (p.y > yMax) yMax = p.y;
  });

  let arr = initializeArray(yMax + 5, xMax + 5);
  points.forEach((p) => {
    arr[p.y][p.x] = true;
  });
  return arr;
}

function initializeArray(nRows, nColumns, initalValue = false) {
  let arr = [];
  for (let i = 0; i <= nRows; i++) {
    let row = [];
    for (let j = 0; j <= nColumns; j++) {
      row.push(initalValue);
    }
    arr.push(row);
  }
  return arr;
}

function foldArray(arr, fold) {
  return fold.axis === "y"
    ? foldArrayUpAt(fold.value, arr)
    : foldArrayLeftAt(fold.value, arr);
}

function foldArrayUpAt(foldIdx, arr) {
  let foldedArr = [];
  for (let row = 0; row < foldIdx; row++) {
    let thisRow = [];
    for (let column = 0; column < arr[row].length; column++) {
      let foldedRow = foldIdx * 2 - row;
      thisRow.push(arr[row][column] || arr[foldedRow][column]);
    }
    foldedArr.push(thisRow);
  }

  return foldedArr;
}

function foldArrayLeftAt(foldIdx, arr) {
  let foldedArr = [];
  for (let row = 0; row < arr.length; row++) {
    let thisRow = [];
    for (let column = 0; column < foldIdx; column++) {
      let foldedColumn = foldIdx * 2 - column;
      thisRow.push(arr[row][column] || arr[row][foldedColumn]);
    }
    foldedArr.push(thisRow);
  }

  return foldedArr;
}

function printArray(arr) {
  arr.forEach((row) => {
    line = "";
    row.forEach((el) => {
      line += el ? "#" : ".";
    });
    console.log(line);
  });
}

function countPoints(arr) {
  let count = 0;
  arr.forEach((row) => {
    row.forEach((el) => {
      if (el) count++;
    });
  });

  return count;
}
