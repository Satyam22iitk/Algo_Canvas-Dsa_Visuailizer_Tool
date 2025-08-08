export default {
  name: "Longest Common Subsequence",
  explanation: `Finds the longest subsequence present in both strings. 
  A subsequence is a sequence that appears in the same relative order, 
  but not necessarily contiguous. Returns both length and the actual LCS.`,
  complexity: {
    time: "O(m*n)",
    space: "O(m*n)"
  },
  code: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array(m+1).fill().map(() => Array(n+1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  
  // Reconstruct the LCS string
  let i = m, j = n;
  const lcs = [];
  while (i > 0 && j > 0) {
    if (text1[i-1] === text2[j-1]) {
      lcs.unshift(text1[i-1]);
      i--;
      j--;
    } else if (dp[i-1][j] > dp[i][j-1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return {
    length: dp[m][n],
    sequence: lcs.join('')
  };
}`,

  visualize: (strings, _, speed, updateState, onComplete) => {
    const [text1, text2] = strings;
    const steps = [];
    const m = text1.length;
    const n = text2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    let lcs = [];

    const createStep = (status, current = null, lcsProgress = null) => ({
      dpTable: JSON.parse(JSON.stringify(dp)),
      text1,
      text2,
      current,
      lcs: lcsProgress || [...lcs],
      status
    });

    steps.push(createStep(`Initialized DP table for LCS`));

    // Build DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = text1[i - 1];
        const char2 = text2[j - 1];

        steps.push(createStep(
          `Comparing ${char1} (pos ${i-1}) and ${char2} (pos ${j-1})`,
          [i, j]
        ));

        if (char1 === char2) {
          dp[i][j] = dp[i-1][j-1] + 1;
          steps.push(createStep(
            `Match found! dp[${i}][${j}] = ${dp[i][j]}`,
            [i, j]
          ));
        } else {
          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
          steps.push(createStep(
            `No match. dp[${i}][${j}] = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`,
            [i, j]
          ));
        }
      }
    }

    // Reconstruct LCS
    steps.push(createStep(`Starting LCS reconstruction...`));
    let i = m, j = n;
    while (i > 0 && j > 0) {
      steps.push(createStep(
        `At dp[${i}][${j}] = ${dp[i][j]}`,
        [i, j]
      ));

      if (text1[i-1] === text2[j-1]) {
        lcs.unshift(text1[i-1]);
        steps.push(createStep(
          `Characters match: '${text1[i-1]}' added to LCS (${lcs.join('')})`,
          [i, j],
          [...lcs]
        ));
        i--;
        j--;
      } else if (dp[i-1][j] > dp[i][j-1]) {
        steps.push(createStep(
          `Moving up (dp[${i-1}][${j}] > dp[${i}][${j-1}])`,
          [i, j]
        ));
        i--;
      } else {
        steps.push(createStep(
          `Moving left (dp[${i}][${j-1}] >= dp[${i-1}][${j}])`,
          [i, j]
        ));
        j--;
      }
    }

    const result = {
      length: dp[m][n],
      sequence: lcs.join('')
    };

    steps.push(createStep(
      `✅ LCS length: ${result.length}, Sequence: "${result.sequence}"`,
      null,
      [...lcs],
      result
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