export default {
  name: "Merge Sort",
  code: `void merge(int arr[], int l, int m, int r) {
  int n1 = m - l + 1;
  int n2 = r - m;

  int L[n1], R[n2];

  for (int i = 0; i < n1; i++) L[i] = arr[l + i];
  for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

  int i = 0, j = 0, k = l;

  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) arr[k++] = L[i++];
    else arr[k++] = R[j++];
  }

  while (i < n1) arr[k++] = L[i++];
  while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
  if (l < r) {
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m+1, r);
    merge(arr, l, m, r);
  }
}`,
  explanation: "Divides array into halves recursively, sorts each half, and merges them back together.",
  complexity: {
    time: "O(n log n)",
    space: "O(n)"
  },

  visualize: (array, target, speed, updateState, onComplete) => {
    const arr = [...array];
    const n = arr.length;
    const steps = [];

    function merge(arr, l, m, r) {
      const leftArr = arr.slice(l, m + 1);
      const rightArr = arr.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;

      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
          arr[k++] = leftArr[i++];
        } else {
          arr[k++] = rightArr[j++];
        }
      }

      while (i < leftArr.length) arr[k++] = leftArr[i++];
      while (j < rightArr.length) arr[k++] = rightArr[j++];

      steps.push({
        type: "merge",
        left: l,
        mid: m,
        right: r,
        array: [...arr]
      });
    }

    function mergeSort(arr, l, r) {
      if (l >= r) return;
      const m = Math.floor((l + r) / 2);
      mergeSort(arr, l, m);
      mergeSort(arr, m + 1, r);
      merge(arr, l, m, r);
    }

    mergeSort(arr, 0, n - 1);

    steps.push({
      type: "complete",
      array: [...arr]
    });

    let stepIndex = 0;
    let isPaused = false;
    let isStopped = false;
    let timeoutId = null;

    const step = () => {
      if (isStopped) return;

      if (isPaused) {
        timeoutId = setTimeout(step, 100);
        return;
      }

      if (stepIndex >= steps.length) {
        updateState({
          status: `✅ Sorting complete`,
          array: arr,
          sortedIndices: Array.from({ length: n }, (_, idx) => idx)
        });
        onComplete && onComplete();
        return;
      }

      const stepData = steps[stepIndex];

      if (stepData.type === "merge") {
        const comparedIndices = Array.from(
          { length: stepData.right - stepData.left + 1 },
          (_, i) => stepData.left + i
        );

        updateState({
          status: `🔀 Merging [${stepData.left}-${stepData.mid}] and [${stepData.mid + 1}-${stepData.right}]`,
          comparedIndices,
          array: stepData.array,
          mergingRange: { left: stepData.left, right: stepData.right }
        });
      } else if (stepData.type === "complete") {
        updateState({
          status: `✅ Sorting complete`,
          array: stepData.array,
          sortedIndices: Array.from({ length: n }, (_, idx) => idx)
        });
      }

      stepIndex++;
      timeoutId = setTimeout(step, 2000 / speed);
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
