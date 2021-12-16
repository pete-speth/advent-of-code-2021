const fs = require("fs");

module.exports = {
  parseInput: (filepath, parseFunction = (i) => i) => {
    return parseFunction(fs.readFileSync(filepath, "utf8"));
  },

  parseInputToLines: (filepath) => {
    return fs.readFileSync(filepath, "utf8").split("\n");
  },

  parseInputLinesToList: (filepath, parseFunction = (i) => i) => {
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

  initMatrix: (m, n, initialValue = 0) => {
    let arr = [];
    for (let i = 0; i < m; i++) {
      let row = [];
      for (let j = 0; j < n; j++) {
        row.push(initialValue);
      }

      arr.push(row);
    }
    return arr;
  },
};
