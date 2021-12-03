const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const booleanArrays = utils.parseInputToList(
      inputFilePath,
      parseToIntArray
    );

    return [
      calculatePowerConsumption(booleanArrays),
      calculateLifeSupportRating(booleanArrays),
    ];
  },
};

function parseToIntArray(line) {
  return line.split("").map((c) => c === "1");
}

function calculatePowerConsumption(booleanArrays) {
  let truthCounts = new Array(booleanArrays[0].length).fill(0);
  booleanArrays.forEach((arr) => {
    for (i in arr) {
      if (arr[i]) truthCounts[i]++;
    }
  });

  let gammaArray = truthCounts.map((count) => booleanArrays.length / count < 2);
  let epsilonArray = gammaArray.map((i) => !i);

  return booleanArrayToInt(gammaArray) * booleanArrayToInt(epsilonArray);
}

function calculateLifeSupportRating(booleanArrays) {
  const o2 = booleanArrayToInt(filterBooleanArrays(booleanArrays, true));
  const co2 = booleanArrayToInt(filterBooleanArrays(booleanArrays, false));
  return o2 * co2;
}

function booleanArrayToInt(arr) {
  let position = 1;
  let total = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i]) total += position;
    position *= 2;
  }
  return total;
}

/**
 * Filter the arrays by the procedure given in the problem
 * isByMostCommon - true to filter using the most common bit, false to use the least common bit
 *
 * Returns the last remaining array
 */
function filterBooleanArrays(booleanArrays, isByMostCommon) {
  let filtered = booleanArrays;
  let i = 0;
  while (filtered.length > 1) {
    // count the 1 bits
    let truthCount = 0;
    filtered.forEach((arr) => {
      if (arr[i]) truthCount++;
    });

    // determine which bit should be kept for this position
    let mostCommon = filtered.length / truthCount <= 2;
    let keeperBit = isByMostCommon ? mostCommon : !mostCommon;

    // filter by keeper bit
    filtered = filtered.filter((arr) => arr[i] === keeperBit);

    i++;
  }

  return filtered[0];
}
