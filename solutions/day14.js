const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const lines = utils.parseInputToLines(inputFilePath);
    const template = lines[0];
    const insertionKey = parseInsertionKey(lines.slice(2, lines.length));

    const countsAfter10 = runSimulation(template, insertionKey, 10);
    const countsAfter40 = runSimulation(template, insertionKey, 40);
    return [findRange(countsAfter10), findRange(countsAfter40)];
  },
};

function parseInsertionKey(lines) {
  let insertionKey = {};
  lines.map((line) => {
    [target, inserted] = line.split(" -> ");
    insertionKey[target] = inserted;
  });
  return insertionKey;
}

function runSimulation(template, insertionKey, numSteps) {
  let countMap = {};
  for (let i in template) {
    insertOrUpdateValue(countMap, template[i], 1, (i) => i + 1);
  }

  let pairMap = {};
  for (let i = 0; i < template.length - 1; i++) {
    let pair = template.slice(i, i + 2);
    insertOrUpdateValue(pairMap, pair, 1, (i) => i + 1);
  }

  for (let i = 0; i < numSteps; i++) {
    pairMap = runSimulationStep(pairMap, countMap, insertionKey);
  }

  return countMap;
}

function runSimulationStep(pairMap, countMap, insertionKey) {
  let newPairMap = {};
  for (let key in pairMap) {
    let insert = insertionKey[key];
    let count = pairMap[key];
    insertOrUpdateValue(countMap, insert, count, (i) => i + count);
    insertOrUpdateValue(newPairMap, key[0] + insert, count, (i) => i + count);
    insertOrUpdateValue(newPairMap, insert + key[1], count, (i) => i + count);
  }

  return newPairMap;
}

function insertOrUpdateValue(obj, key, insertValue, updateFunction) {
  if (obj[key]) {
    obj[key] = updateFunction(obj[key]);
  } else {
    obj[key] = insertValue;
  }
}

function findRange(countMap) {
  let max = 0;
  let min = Infinity;
  for (let key in countMap) {
    if (countMap[key] > max) max = countMap[key];
    if (countMap[key] < min) min = countMap[key];
  }

  return max - min;
}
