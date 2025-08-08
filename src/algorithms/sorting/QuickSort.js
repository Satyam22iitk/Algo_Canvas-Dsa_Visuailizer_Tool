export default {
  name: "Quick Sort",
  code: `int partition(int arr[], int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(arr[i], arr[j]);
    }
  }
  swap(arr[i+1], arr[high]);
  return i+1;
}

void quickSort(int arr[], int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi-1);
    quickSort(arr, pi+1, high);
  }
}`,
  explanation: "Picks pivot, partitions array, and recursively sorts partitions",
  complexity: {
    time: "O(n log n) avg, O(n²) worst",
    space: "O(log n)"
  },

  visualize: (array, target, speed, updateState, onComplete) => {
    const arr = [...array];
    const n = arr.length;
    const stack = [{ low: 0, high: n - 1 }];
    let step = 0;
    let isPaused = false;
    let isStopped = false;
    let timeoutId = null;

    const processPartition = () => {
      if (isStopped) return;

      if (isPaused) {
        timeoutId = setTimeout(processPartition, 100);
        return;
      }

      if (stack.length === 0) {
        updateState({
          status: `✅ Sorting complete in ${step} steps`,
          sortedIndices: Array.from({ length: n }, (_, idx) => idx),
          pivotIndex: null
        });
        onComplete && onComplete();
        return;
      }

      const { low, high } = stack.pop();
      const pivot = arr[high];
      let i = low - 1;
      let j = low;

      updateState({
        status: `🎯 Partitioning [${low}-${high}] with pivot ${pivot}`,
        pivotIndex: high,
        comparedIndices: [high]
      });

      const iterate = () => {
        if (isStopped) return;
        if (isPaused) {
          timeoutId = setTimeout(iterate, 100);
          return;
        }

        if (j < high) {
          if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            updateState({
              status: `🔄 Swapped ${arr[i]} and ${arr[j]}`,
              swappedIndices: [i, j],
              array: [...arr]
            });
          }
          j++;
          timeoutId = setTimeout(iterate, 1000 / speed);
        } else {
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          const pi = i + 1;

          updateState({
            status: `✅ Pivot placed at ${pi}`,
            swappedIndices: [pi, high],
            array: [...arr],
            sortedIndices: [pi]
          });

          if (low < pi - 1) stack.push({ low, high: pi - 1 });
          if (pi + 1 < high) stack.push({ low: pi + 1, high });

          timeoutId = setTimeout(() => {
            step++;
            processPartition();
          }, 1200 / speed);
        }
      };

      timeoutId = setTimeout(iterate, 1000 / speed);
    };

    processPartition();

    return {
      pause: () => (isPaused = true),
      resume: () => {
        if (isPaused) {
          isPaused = false;
          processPartition();
        }
      },
      stop: () => {
        isStopped = true;
        clearTimeout(timeoutId);
      }
    };
  }
};
