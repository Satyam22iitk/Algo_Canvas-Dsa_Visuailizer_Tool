export default {
  name: "Rat in a Maze",
  explanation: `Finds a path for a rat from the top-left corner to the bottom-right corner of a maze. 
  The rat can only move right or down through open cells (0). Blocked cells (1) are obstacles.`,
  complexity: {
    time: "O(2^(n^2))",
    space: "O(n^2)"
  },
  code: `function solveMaze(maze) {
  const n = maze.length;
  const solution = Array(n).fill().map(() => Array(n).fill(0));
  
  function isSafe(x, y) {
    return x >= 0 && x < n && y >= 0 && y < n && maze[x][y] === 0;
  }
  
  function findPath(x, y) {
    if (x === n - 1 && y === n - 1) {
      solution[x][y] = 1;
      return true;
    }
    
    if (isSafe(x, y)) {
      solution[x][y] = 1;
      
      // Move right
      if (findPath(x, y + 1)) return true;
      
      // Move down
      if (findPath(x + 1, y)) return true;
      
      // Backtrack
      solution[x][y] = 0;
      return false;
    }
    
    return false;
  }
  
  return findPath(0, 0) ? solution : null;
}`,
  visualize: (maze, _, speed, updateState, onComplete) => {
    const steps = [];
    const n = maze.length;
    const solution = Array(n).fill().map(() => Array(n).fill(0));

    let stepIndex = 0;
    let intervalId = null;
    let isPaused = false;
    let isStopped = false;

    const clone = (grid) => JSON.parse(JSON.stringify(grid));

    steps.push({
      maze: clone(maze),
      solution: clone(solution),
      status: "🟢 Starting maze solver"
    });

    function isSafe(x, y) {
      return x >= 0 && x < n && y >= 0 && y < n && maze[x][y] === 0;
    }

    function findPath(x, y) {
      if (isStopped) return false;

      if (x === n - 1 && y === n - 1) {
        solution[x][y] = 1;
        steps.push({
          maze: clone(maze),
          solution: clone(solution),
          current: [x, y],
          status: `✅ Reached destination at (${x}, ${y})`
        });
        return true;
      }

      if (isSafe(x, y)) {
        solution[x][y] = 1;
        steps.push({
          maze: clone(maze),
          solution: clone(solution),
          current: [x, y],
          status: `➡️ Moving to (${x}, ${y})`
        });

        if (findPath(x, y + 1)) return true;
        if (findPath(x + 1, y)) return true;

        solution[x][y] = 0;
        steps.push({
          maze: clone(maze),
          solution: clone(solution),
          current: [x, y],
          status: `↩️ Backtracking from (${x}, ${y})`
        });
        return false;
      }

      return false;
    }

    const solved = findPath(0, 0);

    if (solved) {
      steps.push({
        maze: clone(maze),
        solution: clone(solution),
        status: "✅ Found path through maze!"
      });
    } else {
      steps.push({
        maze: clone(maze),
        solution: clone(solution),
        status: "❌ No path found through maze"
      });
    }

    const step = () => {
      if (isStopped) return;

      if (isPaused) {
        intervalId = setTimeout(step, 100); // wait and check again
        return;
      }

      if (stepIndex >= steps.length) {
        onComplete && onComplete();
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
