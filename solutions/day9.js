const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const map = utils.parseInputLinesToList(
      inputFilePath,
      parseLineToListOfInts
    );

    const lowPoints = findLowPoints(map);

    return [
      getRiskLevel(lowPoints),
      getBasinSizeProductThreeLargest(lowPoints, map),
    ];
  },
};

function parseLineToListOfInts(line) {
  let list = [];
  for (let i in line) {
    list.push(parseInt(line.charAt(i)));
  }
  return list;
}

function findLowPoints(map) {
  let lowPoints = [];
  for (let row = 0; row < map.length; row++) {
    for (let column = 0; column < map[row].length; column++) {
      let thisPoint = map[row][column];
      let isLowPoint = true;

      if (isLowPoint && column > 0) {
        isLowPoint = thisPoint < map[row][column - 1];
      }
      if (isLowPoint && column < map[row].length - 1) {
        isLowPoint = thisPoint < map[row][column + 1];
      }
      if (isLowPoint && row > 0) {
        isLowPoint = thisPoint < map[row - 1][column];
      }
      if (isLowPoint && row < map.length - 1) {
        isLowPoint = thisPoint < map[row + 1][column];
      }

      if (isLowPoint) {
        lowPoints.push({ row: row, column: column, value: thisPoint });
      }
    }
  }

  return lowPoints;
}

function getRiskLevel(points) {
  return points.map((p) => p.value + 1).reduce((a, b) => a + b);
}

function getBasinSizeProductThreeLargest(lowPoints, heightMap) {
  return lowPoints
    .map((p) => getBasinSize(p, heightMap))
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a * b);
}

function getBasinSize(lowPoint, heightMap) {
  let checkedMap = heightMap.map((row) => row.map((column) => false));
  return getBasinSizeIter(lowPoint, heightMap, checkedMap);
}

function getBasinSizeIter(point, heightMap, checkedMap) {
  checkedMap[point.row][point.column] = true;
  if (point.value != 9) {
    let sum = 1;
    if (point.row > 0) {
      let downPoint = { row: point.row - 1, column: point.column };
      if (!checkedMap[downPoint.row][downPoint.column]) {
        setPointValue(downPoint, heightMap);
        sum += getBasinSizeIter(downPoint, heightMap, checkedMap);
      }
    }
    if (point.row < heightMap.length - 1) {
      let upPoint = { row: point.row + 1, column: point.column };
      if (!checkedMap[upPoint.row][upPoint.column]) {
        setPointValue(upPoint, heightMap);
        sum += getBasinSizeIter(upPoint, heightMap, checkedMap);
      }
    }
    if (point.column > 0) {
      let leftPoint = { row: point.row, column: point.column - 1 };
      if (!checkedMap[leftPoint.row][leftPoint.column]) {
        setPointValue(leftPoint, heightMap);
        sum += getBasinSizeIter(leftPoint, heightMap, checkedMap);
      }
    }
    if (point.column < heightMap[point.row].length - 1) {
      let rightPoint = { row: point.row, column: point.column + 1 };
      if (!checkedMap[rightPoint.row][rightPoint.column]) {
        setPointValue(rightPoint, heightMap);
        sum += getBasinSizeIter(rightPoint, heightMap, checkedMap);
      }
    }

    return sum;
  } else {
    return 0;
  }
}

function setPointValue(p, map) {
  p.value = map[p.row][p.column];
}
