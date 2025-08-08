export default {
  name: "Subset Sum",
  explanation: `Finds a subset of numbers that adds up to a given target sum. 
  Uses backtracking to explore all possible subsets.`,
  complexity: {
    time: "O(2^n)",
    space: "O(n)"
  },
  code: `function subsetSum(nums, target) {
  const result = [];
  
  function backtrack(start, path, currentSum) {
    if (currentSum === target) {
      result.push([...path]);
      return;
    }
    
    for (let i = start; i < nums.length; i++) {
      if (currentSum + nums[i] <= target) {
        path.push(nums[i]);
        backtrack(i + 1, path, currentSum + nums[i]);
        path.pop();
      }
    }
  }
  
  nums.sort((a, b) => a - b);
  backtrack(0, [], 0);
  return result;
}`,
  visualize: (input, _, speed, updateState, onComplete) => {
    const [nums, target] = input;
    const sortedNums = [...nums].sort((a, b) => a - b);
    const steps = [];
    const result = [];
    const path = [];
    let currentSum = 0;

    let stepIndex = 0;
    let intervalId = null;
    let isPaused = false;
    let isStopped = false;

    steps.push({
        nums: [...sortedNums],
        path: [],
        currentSum: 0,
        target,
        status: `🟢 Starting subset sum for target: ${target}`
    });

    function backtrack(start) {
        if (isStopped) return;

        if (currentSum === target) {
            result.push([...path]);
            steps.push({
                nums: [...sortedNums],
                path: [...path],
                currentSum,
                target,
                status: `✅ Found subset: [${path.join(', ')}] = ${target}`
            });
            return;
        }

        for (let i = start; i < sortedNums.length; i++) {
            if (currentSum + sortedNums[i] <= target) {
                path.push(sortedNums[i]);
                currentSum += sortedNums[i];

                steps.push({
                    nums: [...sortedNums],
                    path: [...path],
                    currentSum,
                    target,
                    status: `➕ Added ${sortedNums[i]} → Current sum: ${currentSum}`
                });

                backtrack(i + 1);

                currentSum -= path.pop();

                steps.push({
                    nums: [...sortedNums],
                    path: [...path],
                    currentSum,
                    target,
                    status: `↩️ Backtracked → Current sum: ${currentSum}`
                });
            }
        }
    }

    backtrack(0);

    // Display all solutions at the end
    if (result.length === 0) {
        steps.push({
            nums: [...sortedNums],
            path: [],
            currentSum: 0,
            target,
            status: `❌ No subset found for target ${target}`
        });
    } else {
        // Create a formatted list of all solutions
        const solutionsList = result.map((subset, idx) => 
            `Solution ${idx + 1}: [${subset.join(', ')}]`
        ).join('\n');
        
        steps.push({
            nums: [...sortedNums],
            path: [],
            currentSum: 0,
            target,
            status: `✅ Found ${result.length} solution(s):\n${solutionsList}`
        });
    }

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
