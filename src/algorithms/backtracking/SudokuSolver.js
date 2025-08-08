export default {
  name: "Sudoku Solver",
  explanation: `Solves a 9x9 Sudoku puzzle using backtracking. 
  Fills empty cells (0) with digits 1-9 such that each row, column, and 3x3 subgrid contains all digits exactly once.`,
  complexity: {
    time: "O(9^(n*n))",
    space: "O(n*n)"
  },
  code: `function solveSudoku(board) {
  // Preprocess board: convert all empty representations to 0
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === '.' || board[i][j] === 0) {
        board[i][j] = 0;
      } else if (typeof board[i][j] === 'string') {
        board[i][j] = parseInt(board[i][j]) || 0;
      }
    }
  }

  function isValid(row, col, num) {
    for (let i = 0; i < 9; i++) {
      // Check row and column
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  }

  function solve() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(row, col, num)) {
              board[row][col] = num;
              if (solve()) return true;
              board[row][col] = 0; // Backtrack to 0 (number)
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  return solve() ? board : null;
}`,
  visualize: (board, _, speed, updateState, onComplete) => {
    // Create deep copy and preprocess board
    const solvedBoard = JSON.parse(JSON.stringify(board));
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (solvedBoard[i][j] === '.' || solvedBoard[i][j] === 0) {
          solvedBoard[i][j] = 0;
        } else if (typeof solvedBoard[i][j] === 'string') {
          solvedBoard[i][j] = parseInt(solvedBoard[i][j]) || 0;
        }
      }
    }

    const steps = [];
    let stepIndex = 0;
    let intervalId = null;
    let isPaused = false;
    let isStopped = false;

    steps.push({
      board: JSON.parse(JSON.stringify(solvedBoard)),
      status: "🟢 Starting Sudoku solver"
    });

    function isValid(row, col, num, currentBoard) {
      for (let i = 0; i < 9; i++) {
        if (currentBoard[row][i] === num || currentBoard[i][col] === num) return false;
      }
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (currentBoard[boxRow + i][boxCol + j] === num) return false;
        }
      }
      return true;
    }

    function solve() {
      if (isStopped) return true;

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (solvedBoard[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              steps.push({
                board: JSON.parse(JSON.stringify(solvedBoard)),
                current: [row, col],
                status: `🔍 Trying ${num} at (${row}, ${col})`
              });

              if (isValid(row, col, num, solvedBoard)) {
                solvedBoard[row][col] = num;
                steps.push({
                  board: JSON.parse(JSON.stringify(solvedBoard)),
                  current: [row, col],
                  status: `✅ Placed ${num} at (${row}, ${col})`
                });

                if (solve()) return true;

                solvedBoard[row][col] = 0; // Backtrack to 0
                steps.push({
                  board: JSON.parse(JSON.stringify(solvedBoard)),
                  current: [row, col],
                  status: `↩️ Backtracking at (${row}, ${col})`
                });
              }
            }
            return false;
          }
        }
      }
      return true;
    }

    const solved = solve();

    if (solved) {
      steps.push({
        board: JSON.parse(JSON.stringify(solvedBoard)),
        status: "🎉 Sudoku solved successfully!"
      });
    } else {
      steps.push({
        board: JSON.parse(JSON.stringify(board)),
        status: "❌ No solution found for this Sudoku puzzle"
      });
    }

    const step = () => {
      if (isStopped) return;

      if (isPaused) {
        intervalId = setTimeout(step, 100);
        return;
      }

      if (stepIndex >= steps.length) {
        onComplete?.();
        return;
      }

      updateState(steps[stepIndex]);
      stepIndex++;

      intervalId = setTimeout(step, 1500 / speed);
    };

    step();

    return {
      pause: () => (isPaused = true),
      resume: () => {
        if (isPaused) {
          isPaused = false;
          step();
        }
      },
      stop: () => {
        isStopped = true;
        clearTimeout(intervalId);
      }
    };
  }
};