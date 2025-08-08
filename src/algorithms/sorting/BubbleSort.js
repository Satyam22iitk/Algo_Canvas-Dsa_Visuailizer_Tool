export default {
  name: "Bubble Sort",
  code: `void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n-1; i++) {
    bool swapped = false;
    for (int j = 0; j < n-i-1; j++) {
      if (arr[j] > arr[j+1]) {
        swap(arr[j], arr[j+1]);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
  explanation: "Repeatedly swaps adjacent elements if they're in wrong order",
  complexity: {
    time: "O(n²)",
    space: "O(1)"
  },

  visualize: (array, target, speed, updateState, onComplete) => {
    const arr = [...array];            // Work on a copy
    const original = [...array];       // For potential reset
    const n = arr.length;

    let i = 0;
    let j = 0;
    let steps = 0;
    let swapped = false;

    let isPaused = false;
    let isStopped = false;
    let isFinished = false;
    let timeoutId = null;

    const pause = () => { isPaused = true; };
    const resume = () => {
      if (isPaused && !isFinished) {
        isPaused = false;
        step();
      }
    };
    const stop = () => {
      isStopped = true;
      clearTimeout(timeoutId);
    };
    const reset = () => {
      isStopped = true;
      isFinished = false;
      clearTimeout(timeoutId);
      i = 0;
      j = 0;
      steps = 0;
      swapped = false;
      arr.splice(0, n, ...original); // restore original array
      updateState({
        status: "🔄 Reset to original input",
        array: [...arr],
        sortedIndices: [],
        comparedIndices: [],
        swappedIndices: []
      });
    };

    const step = () => {
      if (isStopped || isFinished) return;
      if (isPaused) {
        timeoutId = setTimeout(step, 100); // Keep checking
        return;
      }

      if (i >= n - 1) {
        isFinished = true;
        updateState({
          status: `✅ Sorting complete in ${steps} steps`,
          sortedIndices: Array.from({ length: n }, (_, idx) => idx),
          array: [...arr],
          comparedIndices: [],
          swappedIndices: []
        });
        onComplete?.();
        return;
      }

      steps++;

      if (j >= n - i - 1) {
        if (!swapped) {
          isFinished = true;
          updateState({
            status: `✅ Sorting complete (early) in ${steps} steps`,
            sortedIndices: Array.from({ length: n }, (_, idx) => idx),
            array: [...arr],
            comparedIndices: [],
            swappedIndices: []
          });
          onComplete?.();
          return;
        }

        i++;
        j = 0;
        swapped = false;
        updateState({
          status: `🔁 Pass ${i} completed`,
          array: [...arr],
          sortedIndices: [...Array(i).keys()].map(k => n - 1 - k),
          comparedIndices: [],
          swappedIndices: []
        });
        timeoutId = setTimeout(step, 1000 / speed);
        return;
      }

      updateState({
        status: `🔍 Comparing ${arr[j]} and ${arr[j + 1]}`,
        comparedIndices: [j, j + 1],
        array: [...arr],
        swappedIndices: []
      });

      timeoutId = setTimeout(() => {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;

          updateState({
            status: `🔄 Swapped ${arr[j]} and ${arr[j + 1]}`,
            swappedIndices: [j, j + 1],
            array: [...arr],
            comparedIndices: []
          });
        }

        j++;
        timeoutId = setTimeout(step, 1000 / speed);
      }, 1000 / speed);
    };

    step(); // Start visualization
    return { pause, resume, stop, reset };
  }
};
