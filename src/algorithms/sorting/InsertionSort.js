export default {
  name: "Insertion Sort",
  code: `void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; i++) {
    int key = arr[i];
    int j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j+1] = arr[j];
      j--;
    }
    arr[j+1] = key;
  }
}`,
  explanation: "Builds sorted array by inserting one element at a time",
  complexity: {
    time: "O(n²)",
    space: "O(1)"
  },

  visualize: (array, _, speed, updateState, onComplete) => {
    const arr = [...array];
    const n = arr.length;
    let i = 1;
    let j = 0;
    let key = arr[i];
    let steps = 0;
    let shifting = false;

    let isPaused = false;
    let isStopped = false;
    let timeoutId = null;

    const step = () => {
      if (isStopped) return;

      if (isPaused) {
        timeoutId = setTimeout(step, 100);
        return;
      }

      if (i >= n) {
        updateState({
          status: `✅ Sorting complete in ${steps} steps`,
          sortedIndices: Array.from({ length: n }, (_, idx) => idx),
          keyIndex: null
        });
        onComplete && onComplete();
        return;
      }

      steps++;

      if (!shifting) {
        key = arr[i];
        j = i - 1;
        shifting = true;

        updateState({
          status: `🔍 Inserting ${key} at position ${i}`,
          keyIndex: i,
          comparedIndices: [i]
        });

        timeoutId = setTimeout(step, 1500 / speed);
        return;
      }

      if (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];

        updateState({
          status: `➡️ Shifting ${arr[j]} from ${j} to ${j + 1}`,
          swappedIndices: [j, j + 1],
          array: [...arr],
          keyIndex: i
        });

        j--;
        timeoutId = setTimeout(step, 1500 / speed);
      } else {
        arr[j + 1] = key;

        updateState({
          status: `✅ Inserted ${key} at position ${j + 1}`,
          array: [...arr],
          sortedIndices: [...Array(i + 1).keys()],
          keyIndex: null
        });

        i++;
        shifting = false;
        timeoutId = setTimeout(step, 1500 / speed);
      }
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
        clearTimeout(timeoutId);
      }
    };
  }
};
