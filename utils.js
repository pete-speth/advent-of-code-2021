const fs = require("fs");

module.exports = {
  parseInputToLines: (filepath) => {
    return fs.readFileSync(filepath, "utf8").split("\n");
  },

  parseInputToList: (filepath, parseFunction) => {
    return fs
      .readFileSync(filepath, "utf8")
      .split("\n")
      .map((line) => parseFunction(line));
  },
};
