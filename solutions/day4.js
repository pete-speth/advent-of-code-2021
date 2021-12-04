const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const input = utils.parseInputToLines(inputFilePath);

    // bingoGame is mutable, so need two unique copies
    let winningBoard = getWinningBoard(parseBingoGame(input));
    let lastWinningBoard = getWinningBoard(parseBingoGame(input), true);

    return [
      calculateBoardScore(winningBoard),
      calculateBoardScore(lastWinningBoard),
    ];
  },
};

function parseBingoGame(lines) {
  const draws = lines[0].split(",").map((s) => parseInt(s));
  let i = 2;
  let boards = [];
  while (i < lines.length) {
    let board = {
      values: [],
      rowscore: [],
      columnscore: [],
      marks: [[], [], [], [], []],
    };
    while (lines[i]) {
      board.values.push(
        lines[i]
          .trim()
          .split(/\s+/)
          .map((s) => parseInt(s))
      );
      i++;
    }
    boards.push(board);
    i++;
  }

  return { draws, boards };
}

function getWinningBoard(bingoGame, isLastWinning = false) {
  let winningBoard;
  let isWinningBoard = new Array(bingoGame.boards.length).fill(0);
  for (d in bingoGame.draws) {
    const draw = bingoGame.draws[d];
    // for each draw, check every board
    for (b in bingoGame.boards) {
      const board = bingoGame.boards[b];
      for (row in board.values) {
        for (column in board.values[row]) {
          if (board.values[row][column] === draw) {
            // if there is a match with the draw, mark it
            board.marks[row][column] = true;

            // keep track of the marks in each row and column
            if (board.rowscore[row]) {
              board.rowscore[row]++;
            } else {
              board.rowscore[row] = 1;
            }

            if (board.columnscore[column]) {
              board.columnscore[column]++;
            } else {
              board.columnscore[column] = 1;
            }

            // once a row or column score reaches 5, we have a bingo
            if (board.rowscore[row] == 5 || board.columnscore[column] == 5) {
              winningBoard = board;
              winningBoard.lastDraw = draw;
              if (!isLastWinning) {
                // return the first winning board
                return winningBoard;
              } else {
                // keep track of all the boards that have one
                // return the last one to win
                isWinningBoard[b] = 1;
                if (
                  isWinningBoard.reduce((x, y) => x + y) ==
                  isWinningBoard.length
                ) {
                  return winningBoard;
                }
              }
            }
          }
        }
      }
    }
  }
}

function calculateBoardScore(board) {
  let unmarkedSum = 0;
  for (row in board.values) {
    for (column in board.values[row]) {
      if (!board.marks[row][column]) {
        unmarkedSum += board.values[row][column];
      }
    }
  }

  return unmarkedSum * board.lastDraw;
}
