const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const depths = utils.parseInputLinesToList(inputFilePath, parseInt);
    const increases = countIncreases(depths);
    const windowedIncreases = countIncreases(depths, 3);
    return [increases, windowedIncreases];
  },
};

function countIncreases(list, windowSize = 1) {
  let count = 0;
  let prevSum = -1;
  for (let i = windowSize - 1; i < list.length; i++) {
    sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += list[i - j];
    }

    if (prevSum > 0 && sum > prevSum) count++;
    prevSum = sum;
  }
  return count;
}
