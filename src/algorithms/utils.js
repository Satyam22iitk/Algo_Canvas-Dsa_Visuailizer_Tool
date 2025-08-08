// Algorithm categories
export const algorithmCategories = {
  searching: {
    name: "Searching Algorithms",
    hasTarget: true,
    algorithms: [
      { id: 'linear-search', name: 'Linear Search' },
      { id: 'binary-search', name: 'Binary Search' }
    ]
  },
  sorting: {
    name: "Sorting Algorithms",
    hasTarget: false,
    algorithms: [
      { id: 'bubble-sort', name: 'Bubble Sort' },
      { id: 'selection-sort', name: 'Selection Sort' },
      { id: 'insertion-sort', name: 'Insertion Sort' },
      { id: 'merge-sort', name: 'Merge Sort' },
      { id: 'quick-sort', name: 'Quick Sort' },
      { id: 'heap-sort', name: 'Heap Sort' }
    ]
  },
  graph: {
    name: "Graph Algorithms",
    hasTarget: false,
    algorithms: [
      { id: 'bfs', name: 'Breadth-First Search' },
      { id: 'dfs', name: 'Depth-First Search' },
      { id: 'dijkstra', name: "Dijkstra's Algorithm" }
    ]
  }
};

// Generate random inputs based on algorithm type
export const generateRandomInput = (category, algorithm) => {
  let newArray = [];
  let newTarget = undefined;
  const size = Math.floor(Math.random() * 15) + 5;
  
  // Different distributions for different algorithms
  if (algorithm === 'binary-search') {
    // Sorted array for binary search
    newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1)
      .sort((a, b) => a - b);
    newTarget = newArray[Math.floor(Math.random() * newArray.length)];
  } else if (category === 'sorting') {
    // Random array for sorting
    newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  } else {
    // Default for searching
    newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    newTarget = newArray[Math.floor(Math.random() * newArray.length)];
  }
  
  return { newArray, newTarget };
};