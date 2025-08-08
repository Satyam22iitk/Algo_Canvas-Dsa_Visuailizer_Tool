export default {
  name: "Binary Search",
  code: `int binarySearch(int arr[], int size, int target) {
  int low = 0;
  int high = size - 1;
  
  while (low <= high) {
    int mid = low + Math.floor((high - low) / 2);
    
    if (arr[mid] == target) return mid;
    
    if (arr[mid] < target) 
      low = mid + 1;
    else 
      high = mid - 1;
  }
  return -1;
}`,
  explanation: "Works on sorted arrays by repeatedly dividing search interval in half. Highly efficient for large datasets.",
  complexity: {
    time: "O(log n)",
    space: "O(1)"
  },
  visualize: (array, target, speed, updateState, onComplete) => {
    let sortedArray = [...array].sort((a, b) => a - b);
    let low = 0;
    let high = sortedArray.length - 1;
    let steps = 0;
    
    const interval = setInterval(() => {
      steps++;
      if (low > high) {
        clearInterval(interval);
        updateState({
          status: `❌ Element ${target} not found after ${steps} steps`,
          low: null,
          high: null,
          mid: null,
          foundIndex: null,
          comparedIndices: []
        });
        onComplete();
        return;
      }
      
      const mid = Math.floor((low + high) / 2);
      const midValue = sortedArray[mid];
      
      updateState({
        status: `🔍 Step ${steps}: Low=${low}, High=${high}, Mid=${mid}`,
        low,
        high,
        mid,
        comparedIndices: [mid]
      });
      
      if (midValue === target) {
        clearInterval(interval);
        setTimeout(() => {
          updateState({
            status: `✅ Found at position ${mid}`,
            low,
            high,
            mid,
            foundIndex: mid,
            comparedIndices: [mid]
          });
          onComplete();
        }, 1000);
      } else if (midValue < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }, 1500 / speed);
  }
};