export default {
  name: "N-Queens Problem",
  explanation: `Places N queens on an N×N chessboard so that no two queens threaten each other. Uses backtracking to find all valid configurations.`,
  complexity: {
    time: "O(N!)",
    space: "O(N²)"
  },
  code: `function solveNQueens(n) {
  const board = Array.from({length: n}, () => Array(n).fill('.'));
  const solutions = [];
  const cols = new Set();
  const diag1 = new Set(); // diagonal \
  const diag2 = new Set(); // diagonal /

  function backtrack(row) {
    if (row === n) {
      solutions.push(board.map(row => row.join('')));
      return;
    }

    for (let col = 0; col < n; col++) {
      const d1 = row - col;
      const d2 = row + col;
      
      if (!cols.has(col) && !diag1.has(d1) && !diag2.has(d2)) {
        board[row][col] = 'Q';
        cols.add(col);
        diag1.add(d1);
        diag2.add(d2);
        
        backtrack(row + 1);
        
        board[row][col] = '.';
        cols.delete(col);
        diag1.delete(d1);
        diag2.delete(d2);
      }
    }
  }

  backtrack(0);
  return solutions;
}`,
visualize: (input, _, speed, updateState, onComplete) => {
    const n = input[0];
    const steps = [];
    const board = Array.from({ length: n }, () => Array(n).fill('.'));
    const solutions = [];
    let stepIndex = 0;
    let intervalId = null;
    let isPaused = false;
    let isStopped = false;

    const cols = new Set();
    const diag1 = new Set();
    const diag2 = new Set();

    const cloneBoard = () => JSON.parse(JSON.stringify(board));

    function backtrack(row) {
        if (isStopped) return;

        if (row === n) {
            // Store solution without adding to steps yet
            solutions.push(cloneBoard());
            return;
        }

        for (let col = 0; col < n; col++) {
            const d1 = row - col;
            const d2 = row + col;

            steps.push({
                board: cloneBoard(),
                current: [row, col],
                status: `🔍 Checking row ${row}, col ${col}`,
                conflicts: {
                    cols: cols.has(col),
                    diag1: diag1.has(d1),
                    diag2: diag2.has(d2)
                }
            });

            if (!cols.has(col) && !diag1.has(d1) && !diag2.has(d2)) {
                board[row][col] = 'Q';
                cols.add(col);
                diag1.add(d1);
                diag2.add(d2);

                steps.push({
                    board: cloneBoard(),
                    current: [row, col],
                    status: `👑 Placed queen at (${row}, ${col})`,
                    placed: true
                });

                backtrack(row + 1);

                board[row][col] = '.';
                cols.delete(col);
                diag1.delete(d1);
                diag2.delete(d2);

                steps.push({
                    board: cloneBoard(),
                    status: `↩️ Backtracking from row ${row}`,
                    backtracking: true
                });
            }
        }
    }

    steps.push({
        board: cloneBoard(),
        status: `♟️ Initializing ${n}x${n} chessboard`
    });

    backtrack(0);

    // Add all solutions as separate boards
    solutions.forEach((solution, index) => {
        steps.push({
            board: solution,
            status: `🏁 Solution #${index + 1} of ${solutions.length}`,
            solution: true
        });
    });

    // Add final status message
    steps.push({
        board: Array.from({ length: n }, () => Array(n).fill('.')),
        status: solutions.length === 0
            ? "❌ No solution exists for N = " + n
            : `✅ Found ${solutions.length} solution${solutions.length !== 1 ? 's' : ''} for N = ${n}`
    });

    const step = () => {
        if (isStopped) return;

        if (isPaused) {
            intervalId = setTimeout(step, 100);
            return;
        }

        if (stepIndex >= steps.length) {
            onComplete && onComplete();
            return;
        }

        // Show solution steps longer for better visibility
        const delay = steps[stepIndex].solution 
            ? 5000 / speed  // Longer display for solutions
            : 1500 / speed; // Normal speed for other steps

        updateState(steps[stepIndex]);
        stepIndex++;
        intervalId = setTimeout(step, delay);
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
