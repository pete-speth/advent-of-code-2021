const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const commands = utils.parseInputToList(inputFilePath, parseCommand);
    return [simplePositionCalc(commands), calcPositionWithAim(commands)];
  },
};

function parseCommand(line) {
  [direction, value] = line.split(" ");
  return { direction: direction, value: parseInt(value) };
}

function simplePositionCalc(commands) {
  let depth = 0;
  let distance = 0;
  commands.forEach((command) => {
    switch (command.direction) {
      case "up":
        depth -= command.value;
        break;
      case "down":
        depth += command.value;
        break;
      case "forward":
        distance += command.value;
        break;
    }
  });

  return depth * distance;
}

function calcPositionWithAim(commands) {
  let depth = 0;
  let distance = 0;
  let aim = 0;
  commands.forEach((command) => {
    switch (command.direction) {
      case "up":
        aim -= command.value;
        break;
      case "down":
        aim += command.value;
        break;
      case "forward":
        distance += command.value;
        depth += command.value * aim;
        break;
    }
  });

  return depth * distance;
}
