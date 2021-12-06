const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const lanternfishPopulation = utils.parseCommaSeparatedInputToList(
      inputFilePath,
      parseInt
    );

    const futurePopulationAfter80 = calculateFuturePopulationSize(
      lanternfishPopulation,
      80
    );
    const futurePopulationAfter256 = calculateFuturePopulationSize(
      lanternfishPopulation,
      256
    );

    return [futurePopulationAfter80, futurePopulationAfter256];
  },
};

function calculateFuturePopulationSize(population, days) {
  let fishCounts = getFishCountsAtEachStage(population);
  for (let i = 0; i < days; i++) {
    fishCounts = incrementFishStages(fishCounts);
  }
  return fishCounts.reduce((a, b) => a + b);
}

function getFishCountsAtEachStage(population) {
  let fishCounts = new Array(9).fill(0);
  population.forEach((thisFishStage) => fishCounts[thisFishStage]++);
  return fishCounts;
}

function incrementFishStages(fishCountsByStage) {
  const FISH_RESET_STAGE = 6;
  const NEW_FISH_STAGE = 8;

  let newFishCounts = new Array(9).fill(0);
  newFishCounts[FISH_RESET_STAGE] += fishCountsByStage[0];
  newFishCounts[NEW_FISH_STAGE] += fishCountsByStage[0];
  for (let i = 1; i < fishCountsByStage.length; i++) {
    newFishCounts[i - 1] += fishCountsByStage[i];
  }

  return newFishCounts;
}
