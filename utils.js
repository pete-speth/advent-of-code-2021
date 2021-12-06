const fs = require("fs");

module.exports = {
  parseInputToLines: (filepath) => {
    return fs.readFileSync(filepath, "utf8").split("\n");
  },

  parseInputLinesToList: (filepath, parseFunction) => {
    return fs
      .readFileSync(filepath, "utf8")
      .split("\n")
      .map((line) => parseFunction(line));
  },

  parseCommaSeparatedInputToList: (filepath, parseFunction = (i) => i) => {
    return fs
      .readFileSync(filepath, "utf8")
      .split(",")
      .map((el) => parseFunction(el));
  },
};
