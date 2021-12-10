const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const lines = utils.parseInputLinesToList(inputFilePath);
    return [scoreInvalidLines(lines), scoreAutoCompletedLines(lines)];
  },
};

function scoreInvalidLines(lines) {
  return lines
    .map((l) => getLineInfo(l))
    .filter((o) => o.illegalChar)
    .map((o) => scoreIllegalChar(o.illegalChar))
    .reduce((a, b) => a + b);
}

function scoreAutoCompletedLines(lines) {
  let completionStringScores = lines
    .map((l) => getLineInfo(l))
    .filter((o) => !o.illegalChar)
    .map((o) => findAndScoreCompletionString(o.bracketStack));

  completionStringScores.sort((a, b) => a - b);
  let middle = Math.floor(completionStringScores.length / 2);
  return completionStringScores[middle];
}

function getLineInfo(line) {
  let bracketStack = [];

  for (let i = 0; i < line.length; i++) {
    let c = line.charAt(i);
    switch (c) {
      case "(":
      case "[":
      case "{":
      case "<":
        bracketStack.push(c);
        break;
      default:
        if (c != bracketThatCloses(bracketStack.pop())) {
          return { illegalChar: c };
        }
    }
  }

  return { bracketStack };
}

function bracketThatCloses(openingBracket) {
  switch (openingBracket) {
    case "(":
      return ")";
    case "[":
      return "]";
    case "{":
      return "}";
    case "<":
      return ">";
    default:
      throw new Error("Invalid opening bracket passed");
  }
}

function scoreIllegalChar(c) {
  switch (c) {
    case ")":
      return 3;
    case "]":
      return 57;
    case "}":
      return 1197;
    case ">":
      return 25137;
  }
}

function findAndScoreCompletionString(bracketStack) {
  let total = 0;
  while (bracketStack.length > 0) {
    total *= 5;
    total += scoreCompletionChar(bracketThatCloses(bracketStack.pop()));
  }
  return total;
}

function scoreCompletionChar(c) {
  switch (c) {
    case ")":
      return 1;
    case "]":
      return 2;
    case "}":
      return 3;
    case ">":
      return 4;
  }
}
