export default {
  name: "Linear Search",
  code: `int linearSearch(int arr[], int n, int target) {
  for (int i = 0; i < n; i++) {
    if (arr[i] == target) {
      return i;  // Element found
    }
  }
  return -1;  // Element not found
}`,
  explanation: "Checks each element sequentially until target is found or end is reached. Best for small/unsorted datasets.",
  complexity: {
    time: "O(n)",
    space: "O(1)"
  },
  visualize: (array, target, speed, updateState, onComplete) => {
    let step = 0;
    const interval = setInterval(() => {
      if (step >= array.length) {
        clearInterval(interval);
        updateState({
          status: `❌ Element ${target} not found after ${array.length} steps`,
          index: null,
          foundIndex: null,
          comparedIndices: []
        });
        onComplete();
        return;
      }
      
      const current = array[step];
      if (current === target) {
        clearInterval(interval);
        updateState({
          status: `✅ Found at index ${step} in ${step+1} steps`,
          index: step,
          foundIndex: step,
          comparedIndices: [step]
        });
        setTimeout(onComplete, 1000);
      } else {
        updateState({
          status: `🔍 Checking index ${step} (${current})`,
          index: step,
          foundIndex: null,
          comparedIndices: [step]
        });
        step++;
      }
    }, 1000 / speed);
  }
};