export default {
  name: "Selection Sort",
  code: `void selectionSort(int arr[], int n) {
  for (int i = 0; i < n-1; i++) {
    int minIndex = i;
    for (int j = i+1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // Swap
    int temp = arr[minIndex];
    arr[minIndex] = arr[i];
    arr[i] = temp;
  }
}`,
  explanation: "Finds minimum element and swaps it with first unsorted position",
  complexity: {
    time: "O(n²)",
    space: "O(1)"
  },

  visualize: (array, target, speed, updateState, onComplete) => {
    const arr = [...array];
    const n = arr.length;
    let i = 0;
    let j = i + 1;
    let minIndex = i;
    let steps = 0;
    let isPaused = false;
    let isStopped = false;
    let timeoutId = null;

    const loop = () => {
      if (isStopped) return;

      if (isPaused) {
        timeoutId = setTimeout(loop, 100);
        return;
      }

      if (i >= n - 1) {
        updateState({
          status: `✅ Sorting complete in ${steps} steps`,
          sortedIndices: Array.from({ length: n }, (_, idx) => idx)
        });
        onComplete && onComplete();
        return;
      }

      steps++;

      if (j >= n) {
        // Swap min with first unsorted
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        updateState({
          status: `🔄 Swapped ${arr[i]} and ${arr[minIndex]}`,
          swappedIndices: [i, minIndex],
          array: [...arr],
          sortedIndices: [...Array(i + 1).keys()]
        });
        i++;
        j = i + 1;
        minIndex = i;
        timeoutId = setTimeout(loop, 1500 / speed);
        return;
      }

      updateState({
        status: `🔍 Comparing ${arr[j]} and ${arr[minIndex]}`,
        comparedIndices: [j, minIndex],
        minIndex: minIndex
      });

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        updateState({
          status: `🔍 New min: ${arr[minIndex]} at ${minIndex}`,
          minIndex: minIndex
        });
      }

      j++;
      timeoutId = setTimeout(loop, 1500 / speed);
    };

    loop();

    return {
      pause: () => { isPaused = true; },
      resume: () => {
        if (isPaused) {
          isPaused = false;
          loop();
        }
      },
      stop: () => {
        isStopped = true;
        clearTimeout(timeoutId);
      }
    };
  }
};
