const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const octoMap1 = utils.parseInputLinesToList(
      inputFilePath,
      parseLineToListOfInts
    );

    octoMap1.flashes = 0;
    runSimulationFor(100, octoMap1);

    const octoMap2 = utils.parseInputLinesToList(
      inputFilePath,
      parseLineToListOfInts
    );
    octoMap2.flashes = 0;
    
    return [octoMap1.flashes, runSimulationUntilAllFlash(octoMap2)];
  },
};

function parseLineToListOfInts(line) {
  let list = [];
  for (let i = 0; i < line.length; i++) {
    list.push(parseInt(line.charAt(i)));
  }
  return list;
}

function runSimulationFor(steps, octoMap) {
  for (let i = 0; i < steps; i++) {
    runSimulationStep(octoMap);
  }
}

function runSimulationUntilAllFlash(octoMap) {
  let count = 0;
  let lastFlashCount = octoMap.flashes;
  while (octoMap.flashes - lastFlashCount < 100) {
    lastFlashCount = octoMap.flashes;
    runSimulationStep(octoMap);
    count++;
  }

  return count;
}

function runSimulationStep(octoMap) {
  increaseEnergyLevels(octoMap);
  runAllFlashes(octoMap);
}

function increaseEnergyLevels(octoMap) {
  for (let i = 0; i < octoMap.length; i++) {
    for (let j = 0; j < octoMap[i].length; j++) {
      octoMap[i][j]++;
    }
  }
}

function runAllFlashes(octoMap) {
  for (let i = 0; i < octoMap.length; i++) {
    for (let j = 0; j < octoMap[i].length; j++) {
      if (octoMap[i][j] > 9) flash(i, j, octoMap);
    }
  }
}

function flash(row, column, octoMap) {
  octoMap[row][column] = 0;
  octoMap.flashes++;
  // increase each neighbor by 1 if it exists and is not already 0
  // if the neighbor is above 9, make it flash also
  if (column > 0) {
    if (octoMap[row][column - 1] > 0) octoMap[row][column - 1]++;
    if (octoMap[row][column - 1] > 9) flash(row, column - 1, octoMap);

    if (row > 0) {
      if (octoMap[row - 1][column - 1] > 0) octoMap[row - 1][column - 1]++;
      if (octoMap[row - 1][column - 1] > 9) flash(row - 1, column - 1, octoMap);
    }
    if (row < octoMap.length - 1) {
      if (octoMap[row + 1][column - 1] > 0) octoMap[row + 1][column - 1]++;
      if (octoMap[row + 1][column - 1] > 9) flash(row + 1, column - 1, octoMap);
    }
  }
  if (column < octoMap[row].length - 1) {
    if (octoMap[row][column + 1] > 0) octoMap[row][column + 1]++;
    if (octoMap[row][column + 1] > 9) flash(row, column + 1, octoMap);

    if (row > 0) {
      if (octoMap[row - 1][column + 1] > 0) octoMap[row - 1][column + 1]++;
      if (octoMap[row - 1][column + 1] > 9) flash(row - 1, column + 1, octoMap);
    }
    if (row < octoMap.length - 1) {
      if (octoMap[row + 1][column + 1] > 0) octoMap[row + 1][column + 1]++;
      if (octoMap[row + 1][column + 1] > 9) flash(row + 1, column + 1, octoMap);
    }
  }
  if (row > 0) {
    if (octoMap[row - 1][column] > 0) octoMap[row - 1][column]++;
    if (octoMap[row - 1][column] > 9) flash(row - 1, column, octoMap);
  }
  if (row < octoMap.length - 1) {
    if (octoMap[row + 1][column] > 0) octoMap[row + 1][column]++;
    if (octoMap[row + 1][column] > 9) flash(row + 1, column, octoMap);
  }
}

function printMap(octoMap) {
  octoMap.forEach((row) => console.log(row.join("")));
  console.log();
}
