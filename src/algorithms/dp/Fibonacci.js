export default {
  name: "Fibonacci Sequence",
  explanation: `Calculates the nth Fibonacci number using dynamic programming. 
  Demonstrates both memoization (top-down) and tabulation (bottom-up) approaches.`,
  complexity: {
    time: "O(n)",
    space: "O(n)"
  },
  code: `function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  
  memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
  return memo[n];
}

function fibTab(n) {
  if (n <= 1) return n;
  
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}`,

visualize: (n, _, speed, updateState, onComplete) => {
  const steps = [];
  const memo = {};
  let stepIndex = 0;
  let intervalId = null;
  let isPaused = false;
  let isStopped = false;

  // Enhanced step tracking with current n and call stack
  const addStep = (data) => {
    steps.push({
      fibN: n,
      callStack: Object.keys(memo).map(Number).sort((a, b) => a - b),
      ...data
    });
  };

  const fibMemo = (num) => {
    if (num <= 1) {
      memo[num] = num;
      addStep({
        dpTable: { ...memo },
        current: num,
        status: `Base case: fib(${num}) = ${num}`,
        highlight: [num]  // Highlight the base case
      });
      return num;
    }
    
    if (memo[num]) {
      addStep({
        dpTable: { ...memo },
        current: num,
        status: `Using memoized value: fib(${num}) = ${memo[num]}`,
        highlight: [num]  // Highlight the memoized value
      });
      return memo[num];
    }

    addStep({
      dpTable: { ...memo },
      current: num,
      status: `Calculating fib(${num}) = fib(${num-1}) + fib(${num-2})`,
      highlight: [num, num-1, num-2]  // Highlight current and dependencies
    });

    const left = fibMemo(num-1);
    const right = fibMemo(num-2);
    memo[num] = left + right;

    addStep({
      dpTable: { ...memo },
      current: num,
      status: `Computed fib(${num}) = ${left} + ${right} = ${memo[num]}`,
      highlight: [num]  // Highlight the newly computed value
    });

    return memo[num];
  };

  addStep({
    dpTable: {},
    status: `Starting Fibonacci calculation for fib(${n})`,
    highlight: []
  });

  const result = fibMemo(n);

  addStep({
    dpTable: { ...memo },
    status: `✅ Final result: fib(${n}) = ${result}`,
    result,
    highlight: Object.keys(memo).map(Number)  // Highlight all computed values
  });

  const step = () => {
    if (isStopped) return;

    if (isPaused) {
      intervalId = setTimeout(step, 100); // Polling for resume
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
    },
    getCurrentStep: () => stepIndex,
    getTotalSteps: () => steps.length
  };
}
};