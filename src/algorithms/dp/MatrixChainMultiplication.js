export default {
  name: "Matrix Chain Multiplication",
  explanation: `Determines the optimal parenthesization of a matrix chain product to minimize the number of scalar multiplications.`,
  complexity: {
    time: "O(n³)",
    space: "O(n²)"
  },
  code: `function matrixChainOrder(dims) {
  const n = dims.length - 1;
  const dp = Array(n).fill().map(() => Array(n).fill(0));
  
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i < n - len + 1; i++) {
      const j = i + len - 1;
      dp[i][j] = Number.MAX_SAFE_INTEGER;
      
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k+1][j] + dims[i] * dims[k+1] * dims[j+1];
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
        }
      }
    }
  }
  
  return dp[0][n-1];
}`,

  visualize: (dims, _, speed, updateState, onComplete) => {
    const steps = [];
    const n = dims.length - 1;
    const dp = Array(n).fill().map(() => Array(n).fill(0));

    const createStep = (status, current = null, split = null) => ({
      dpTable: JSON.parse(JSON.stringify(dp)),
      dims,
      current,
      split,
      status
    });

    steps.push(createStep("Initialized DP table for Matrix Chain Multiplication"));

    for (let len = 2; len <= n; len++) {
      steps.push(createStep(
        `Processing chains of length ${len}`
      ));

      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        dp[i][j] = Number.MAX_SAFE_INTEGER;

        steps.push(createStep(
          `Calculating optimal cost for matrices ${i} to ${j}`,
          [i, j]
        ));

        for (let k = i; k < j; k++) {
          const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];

          steps.push(createStep(
            `Split at ${k}: cost = ${dp[i][k]} + ${dp[k + 1][j]} + ${dims[i]}*${dims[k + 1]}*${dims[j + 1]} = ${cost}`,
            [i, j],
            k
          ));

          if (cost < dp[i][j]) {
            dp[i][j] = cost;
            steps.push(createStep(
              `Updated min cost for [${i},${j}] to ${cost}`,
              [i, j],
              k
            ));
          }
        }
      }
    }

    steps.push(createStep(
      `✅ Minimum multiplications: ${dp[0][n - 1]}`,
      null,
      null,
      dp[0][n - 1]
    ));

    let stepIndex = 0;
    let isPaused = false;
    let isStopped = false;
    let intervalId = null;

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