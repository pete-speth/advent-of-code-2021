const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const positions = utils.parseCommaSeparatedInputToList(
      inputFilePath,
      parseInt
    );

    positions.sort((x, y) => x - y);
    return [
      getOptimizedFuelCostConstantConsumption(positions),
      getOptimizedFuelCostVariableConsumption(positions),
    ];
  },
};

function getOptimizedFuelCostConstantConsumption(sortedPositions) {
  const rendevous =
    calculateOptimalRendezvousConstantConsumption(sortedPositions);
  return calculateFuelCostConstantConsumption(sortedPositions, rendevous);
}

function calculateOptimalRendezvousConstantConsumption(sortedPositions) {
  /**
   * as you move along the horizontal axis,
   * the best rendezvous point will be the last point
   * where you are getting closer to over half of the ships
   */
  const rendevousIndex =
    sortedPositions % 2 == 0
      ? sortedPositions / 2 - 1
      : Math.floor(sortedPositions.length / 2);
  const rendevous = sortedPositions[rendevousIndex];
  return rendevous;
}

function calculateFuelCostConstantConsumption(positions, rendevous) {
  let cost = 0;
  positions.forEach((p) => (cost += Math.abs(rendevous - p)));
  return cost;
}

function getOptimizedFuelCostVariableConsumption(sortedPositions) {
  let rendezvous = 0;
  let totalCost = calculateCostVariableConsumption(sortedPositions, rendezvous);
  let lastTotalCost = totalCost + 1;
  while (totalCost < lastTotalCost) {
    rendezvous++;
    lastTotalCost = totalCost;
    totalCost = calculateCostVariableConsumption(sortedPositions, rendezvous);
  }
  return lastTotalCost;
}

function calculateCostVariableConsumption(positions, rendezvous) {
  index = 0;
  while (positions[index] < rendezvous) {
    index++;
  }

  let leftCost = positions
    .slice(0, index)
    .map((p) => summation(rendezvous - p))
    .reduce((a, b) => a + b, 0);
  let rightCost = positions
    .slice(index, positions.length)
    .map((p) => summation(p - rendezvous))
    .reduce((a, b) => a + b, 0);

  return leftCost + rightCost;
}

function summation(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}
