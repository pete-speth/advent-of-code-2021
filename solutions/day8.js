const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const tests = utils.parseInputLinesToList(
      inputFilePath,
      parseInputsAndOutputs
    );

    return [countKnownDigitsInAllOutput(tests), sumDecodedOutput(tests)];
  },
};

function parseInputsAndOutputs(line) {
  let [inputs, outputs] = line.split("|").map((s) => s.trim().split(" "));
  return { inputs, outputs };
}

function countKnownDigitsInAllOutput(tests) {
  const acceptedLengths = [2, 3, 4, 7];
  let sum = 0;
  tests.forEach((test) => {
    test.outputs.forEach((output) => {
      if (acceptedLengths.includes(output.length)) {
        sum++;
      }
    });
  });

  return sum;
}

function sumDecodedOutput(tests) {
  return tests
    .map((test) => crackCodeAndDecodeOutput(test))
    .reduce((a, b) => a + b);
}

function crackCodeAndDecodeOutput(test) {
  const key = determineDigitKeyByInput(test.inputs);
  return decodeOutput(test.outputs, key);
}

function determineDigitKeyByInput(codedInputs) {
  /**
   * Digit is:
   *    1 if it has 2 segments
   *    4 if it has 4 segments
   *    7 if it has 3 segments
   *    8 if it has 7 segments
   *
   * Identify these digits first so we can
   * use them to deduce the others
   */
  let digits = new Array(10).fill("");
  let unknownDigits = [];
  codedInputs.forEach((input, idx) => {
    switch (input.length) {
      case 2:
        digits[1] = input;
        break;
      case 3:
        digits[7] = input;
        break;
      case 4:
        digits[4] = input;
        break;
      case 7:
        digits[8] = input;
        break;
      default:
        unknownDigits.push(input);
        break;
    }
  });

  /**
   * Digit is:
   *    3 if it has 5 segments and contains all from 1
   *    9 if it has 6 segments and contains all from 3
   *    6 if it has 6 segments and does not contain all from 1
   *    5 if it has 5 segments and that all fit into 6
   *    0 if it has 6 segments and is not 6 or 9
   *    2 if it has 5 segments and is not 5 or 3
   *
   * A few of these rules have 1 or 2 dependencies on other digits being known
   * so, if we get are not able to identify a digit because we haven't
   * yet identified all the depencencies, we will replace it at the back
   * of the queue. We'll continue iterating until all are solved.
   */

  let idx = 0;
  while (idx < unknownDigits.length) {
    let input = unknownDigits[idx];
    let isAssigned = false;
    switch (input.length) {
      case 5:
        if (firstContainsAllFromSecond(input, digits[1])) {
          digits[3] = input;
          isAssigned = true;
          break;
        }
        if (digits[6] && firstContainsAllFromSecond(digits[6], input)) {
          digits[5] = input;
          isAssigned = true;
          break;
        }
        if (digits[3] && digits[5]) {
          digits[2] = input;
          isAssigned = true;
          break;
        }
        break;
      case 6:
        if (!firstContainsAllFromSecond(input, digits[1])) {
          digits[6] = input;
          isAssigned = true;
          break;
        }
        if (digits[3] && firstContainsAllFromSecond(input, digits[3])) {
          digits[9] = input;
          isAssigned = true;
          break;
        }
        if (digits[6] && digits[9]) {
          digits[0] = input;
          isAssigned = true;
          break;
        }
        break;
      default:
        throw new Error("Something went wrong");
    }

    if (!isAssigned) {
      unknownDigits.push(input);
    }
    idx++;
  }

  return digits;
}

function decodeOutput(codedOutput, key) {
  let decodedOutput = "";
  codedOutput.forEach((code) => {
    for (digit in key) {
      if (key[digit].length == code.length) {
        if (firstContainsAllFromSecond(key[digit], code)) {
          decodedOutput += digit;
          break;
        }
      }
    }
  });
  return parseInt(decodedOutput);
}

function firstContainsAllFromSecond(container, contained) {
  for (i in contained) {
    if (!container.includes(contained.charAt(i))) return false;
  }

  return true;
}
