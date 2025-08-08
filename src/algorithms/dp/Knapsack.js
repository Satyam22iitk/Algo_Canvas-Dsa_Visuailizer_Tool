export default {
  name: "0/1 Knapsack Problem",
  explanation: `Given weights and values of items, put these items in a knapsack of capacity W to get the maximum total value. 
Cannot break items; either take it or don't (0-1 property).`,

  complexity: {
    time: "O(n*W)",
    space: "O(n*W)"
  },

  code: `function knapSack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n+1).fill().map(() => Array(capacity+1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(
          values[i-1] + dp[i-1][w - weights[i-1]], 
          dp[i-1][w]
        );
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }

  return dp[n][capacity];
}`,

  visualize: (input, _, speed, updateState, onComplete) => {
    const [weights, values, capacity] = input;
    const steps = [];
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    let stepIndex = 0;
    let isPaused = false;
    let isStopped = false;
    let intervalId = null;

    // Helper function to create consistent step objects
    const createStep = (status, current = null, result = null) => ({
      dpTable: JSON.parse(JSON.stringify(dp)),
      weights,
      values,
      capacity,
      current,
      result,
      status
    });

    // Initial step
    steps.push(createStep(`Initialized DP table for 0/1 Knapsack`));

    // Algorithm steps
    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        // Before processing cell
        steps.push(createStep(
          `Considering item ${i - 1} (weight: ${weights[i - 1]}, value: ${values[i - 1]}) at capacity ${w}`,
          [i, w]
        ));

        if (weights[i - 1] <= w) {
          const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
          const exclude = dp[i - 1][w];
          dp[i][w] = Math.max(include, exclude);

          // After processing (include case)
          steps.push(createStep(
            `Item fits: max(include=${include}, exclude=${exclude}) = ${dp[i][w]}`,
            [i, w]
          ));
        } else {
          dp[i][w] = dp[i - 1][w];
          
          // After processing (exclude case)
          steps.push(createStep(
            `Item doesn't fit. Carrying forward: ${dp[i][w]}`,
            [i, w]
          ));
        }
      }
    }

    // Final result step
    steps.push(createStep(
      `✅ Maximum value: ${dp[n][capacity]}`,
      null,
      dp[n][capacity]
    ));

    // Animation controller
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

      updateState(steps[stepIndex]);
      stepIndex++;

      intervalId = setTimeout(step, 1500 / speed);
    };

    // Start visualization
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