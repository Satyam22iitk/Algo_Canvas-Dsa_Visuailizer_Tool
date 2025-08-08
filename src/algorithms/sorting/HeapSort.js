export default {
  name: "Heap Sort",
  code: `void heapify(int arr[], int n, int i) {
  int largest = i;
  int left = 2*i + 1;
  int right = 2*i + 2;
  
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  
  if (largest != i) {
    swap(arr[i], arr[largest]);
    heapify(arr, n, largest);
  }
}

void heapSort(int arr[], int n) {
  // Build heap
  for (int i = n/2 - 1; i >= 0; i--)
    heapify(arr, n, i);
  
  // Extract elements
  for (int i = n-1; i > 0; i--) {
    swap(arr[0], arr[i]);
    heapify(arr, i, 0);
  }
}`,
  explanation: "Builds max heap and repeatedly extracts maximum element",
  complexity: {
    time: "O(n log n)",
    space: "O(1)"
  },
  visualize: (array, target, speed, updateState, onComplete) => {
    const arr = [...array];
    const n = arr.length;
    let step = 0;
    let phase = "build"; // "build" or "extract"
    let i = Math.floor(n/2) - 1;
    let heapSize = n;
    
    const heapify = (arr, n, i, callback) => {
      let largest = i;
      const left = 2*i + 1;
      const right = 2*i + 2;
      
      if (left < n && arr[left] > arr[largest]) largest = left;
      if (right < n && arr[right] > arr[largest]) largest = right;
      
      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        updateState({
          status: `🔄 Heapify: Swapped ${arr[i]} and ${arr[largest]}`,
          swappedIndices: [i, largest],
          array: [...arr]
        });
        setTimeout(() => heapify(arr, n, largest, callback), 1500 / speed);
      } else {
        callback();
      }
    };
    
    const nextStep = () => {
      step++;
      if (phase === "build") {
        if (i >= 0) {
          heapify(arr, n, i, () => {
            updateState({
              status: `🏗️ Built heap at index ${i}`,
              sortedIndices: []
            });
            i--;
            nextStep();
          });
        } else {
          phase = "extract";
          i = n-1;
          nextStep();
        }
      } else if (phase === "extract") {
        if (i > 0) {
          [arr[0], arr[i]] = [arr[i], arr[0]];
          updateState({
            status: `📤 Extracted max: ${arr[i]}`,
            swappedIndices: [0, i],
            array: [...arr],
            sortedIndices: [...Array(n-i).keys()].map(idx => i+idx)
          });
          
          heapSize = i;
          heapify(arr, heapSize, 0, () => {
            i--;
            nextStep();
          });
        } else {
          updateState({
            status: `✅ Sorting complete in ${step} steps`,
            sortedIndices: Array.from({ length: n }, (_, idx) => idx)
          });
          onComplete();
        }
      }
    };
    
    nextStep();
  }
};