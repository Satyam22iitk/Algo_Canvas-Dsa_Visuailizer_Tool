export default {
  name: "Longest Increasing Subsequence",
  explanation: `Finds the length of the longest subsequence of a given sequence such that all elements of the subsequence are sorted in increasing order.`,
  complexity: {
    time: "O(n²)",
    space: "O(n)"
  },
  code: `function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  
  const dp = Array(nums.length).fill(1);
  let max = 1;
  
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
        max = Math.max(max, dp[i]);
      }
    }
  }
  
  return max;
}`,

  visualize: (nums, _, speed, updateState, onComplete) => {
    const steps = [];
    const dp = Array(nums.length).fill(1);
    let max = 1;

    const createStep = (status, current = null, comparing = null) => ({
      dpTable: [...dp],
      nums,
      current,
      comparing,
      status
    });

    steps.push(createStep("Initialized DP array with 1s"));

    for (let i = 1; i < nums.length; i++) {
      steps.push(createStep(
        `Processing element ${i}: ${nums[i]}`,
        i
      ));

      for (let j = 0; j < i; j++) {
        steps.push(createStep(
          `Comparing with element ${j}: ${nums[j]} (${nums[i]} > ${nums[j]}? ${nums[i] > nums[j]})`,
          i,
          j
        ));

        if (nums[i] > nums[j]) {
          const newVal = dp[j] + 1;
          if (newVal > dp[i]) {
            dp[i] = newVal;
            max = Math.max(max, dp[i]);
            steps.push(createStep(
              `Updating LIS at ${i}: ${newVal} (based on ${j})`,
              i,
              j
            ));
          }
        }
      }
    }

    steps.push(createStep(
      `✅ Longest Increasing Subsequence length: ${max}`,
      null,
      null,
      max
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