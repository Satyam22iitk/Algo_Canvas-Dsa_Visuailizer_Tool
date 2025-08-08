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
     // { id: 'heap-sort', name: 'Heap Sort' }
    ]
  },
  graph: {
    name: "Graph Algorithms",
    hasTarget: false,
    hasSource: true,
    algorithms: [
      { id: 'bfs', name: 'Breadth-First Search' },
      { id: 'dfs', name: 'Depth-First Search' },
      { id: 'dijkstra', name: "Dijkstra's Algorithm" },
      { id: 'bellman-ford', name: 'Bellman-Ford' },
      { id: 'kruskal', name: "Kruskal's MST" },
      { id: 'prim', name: "Prim's MST" },
      { id: 'topological', name: 'Topological Sort' },
      { id: 'cycle', name: 'Cycle Detection' }
    ]
  },
  tree: {
    name: "Tree Algorithms",
    hasTarget: true,
    algorithms: [
      { id: "bst-search", name: "BST Search" },
      // { id: "bst-delete", name: "BST Delete" },
      { id: "inorder-traversal", name: "Inorder Traversal" },
      { id: "preorder-traversal", name: "Preorder Traversal" },
      { id: "postorder-traversal", name: "Postorder Traversal" },
      // { id: "avl-insert", name: "AVL Insert" }
    ]
  },
  dp: {
    name: "Dynamic Programming",
    hasTarget: false,
    algorithms: [
      { id: "fibonacci", name: "Fibonacci Sequence" },
      { id: "lcs", name: "Longest Common Subsequence" },
      { id: "knapsack", name: "0/1 Knapsack" },
      { id: "lis", name: "Longest Increasing Subsequence" },
      { id: "mcm", name: "Matrix Chain Multiplication" }
    ]
  },
  backtracking: {
    name: "Backtracking Algorithms",
    hasTarget: false,
    algorithms: [
      { id: "nqueens", name: "N-Queens Problem" },
      // { id: "sudoku", name: "Sudoku Solver" },
      { id: "ratmaze", name: "Rat in a Maze" },
      { id: "subsetsum", name: "Subset Sum" }
    ]
  }
};

export const generateRandomInput = (category, algorithm) => {
  const graphProperties = {
    'bfs': { directed: false, weighted: false },
    'dfs': { directed: false, weighted: false },
    'dijkstra': { directed: false, weighted: true },
    'bellman-ford': { directed: true, weighted: true },
    'kruskal': { directed: false, weighted: true },
    'prim': { directed: false, weighted: true },
    'topological': { directed: true, weighted: false },
    'cycle': { directed: false, weighted: false }
  };

  // Helper function for edge weights
  const getEdgeWeight = (algo) => {
    if (algo === 'bellman-ford') {
      return Math.floor(Math.random() * 16) - 5; // -5 to 10
    }
    return Math.floor(Math.random() * 9) + 1; // 1 to 9
  };

  // Tree algorithms
  // In the tree section of generateRandomInput function:
if (category === 'tree') {
    const size = Math.floor(Math.random() * 6) + 5; // 5-10 nodes
    const uniqueValues = new Set();
    
    // Generate unique values
    while (uniqueValues.size < size) {
        uniqueValues.add(Math.floor(Math.random() * 90) + 10);
    }
    
    const arr = Array.from(uniqueValues);
    let target = arr[Math.floor(Math.random() * arr.length)];

    if (algorithm === 'bst-insert' || algorithm === 'avl-insert') {
        target = Math.floor(Math.random() * 90) + 10;
        while (arr.includes(target)) {
            target = Math.floor(Math.random() * 90) + 10;
        }
    }

    return {
        newArray: arr,
        newTarget: target,
        newGraph: null,
        sourceNode: null,
        destinationNode: null
    };
}
  // Graph algorithms with circular layout
  if (category === 'graph') {
    const isDirected = graphProperties[algorithm]?.directed || false;
    const isWeighted = graphProperties[algorithm]?.weighted || false;
    const nodeCount = Math.floor(Math.random() * 4) + 5; // 5-8 nodes
    
    // Circular node positioning
    const centerX = 400;
    const centerY = 300;
    const radius = 200;
    const angleStep = (2 * Math.PI) / nodeCount;
    
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      label: String.fromCharCode(65 + i),
      x: centerX + radius * Math.cos(i * angleStep),
      y: centerY + radius * Math.sin(i * angleStep)
    }));

    // SPECIAL HANDLING FOR TOPOLOGICAL SORT (DAG generation)
    if (algorithm === 'topological') {
      // Generate random node order
      const order = Array.from({ length: nodeCount }, (_, i) => i);
      for (let i = nodeCount - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }

      const edges = [];
      const addedEdges = new Set();

      // Create spanning tree respecting topological order
      for (let i = 1; i < nodeCount; i++) {
        const parentOrderIndex = Math.floor(Math.random() * i);
        const source = order[parentOrderIndex];
        const target = order[i];
        const edgeKey = `${source}-${target}`;
        
        addedEdges.add(edgeKey);
        edges.push({
          id: `e${edges.length}`,
          source,
          target,
          weight: 1
        });
      }

      // Add extra edges (only forward in ordering)
      const extraEdges = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < extraEdges; i++) {
        if (edges.length >= nodeCount * (nodeCount - 1) / 2) break;

        let sourceOrderIdx, targetOrderIdx;
        let source, target, edgeKey;
        let attempts = 0;

        do {
          sourceOrderIdx = Math.floor(Math.random() * (nodeCount - 1));
          targetOrderIdx = sourceOrderIdx + 1 + Math.floor(Math.random() * (nodeCount - sourceOrderIdx - 1));
          source = order[sourceOrderIdx];
          target = order[targetOrderIdx];
          edgeKey = `${source}-${target}`;
          attempts++;
        } while (addedEdges.has(edgeKey) && attempts < 100);

        if (attempts < 100) {
          addedEdges.add(edgeKey);
          edges.push({
            id: `e${edges.length}`,
            source,
            target,
            weight: 1
          });
        }
      }

      return {
        newGraph: {
          nodes,
          edges,
          directed: true,
          weighted: false
        },
        sourceNode: null,
        destinationNode: null,
        newArray: null,
        newTarget: null
      };
    }

    // GENERAL GRAPH GENERATION (non-topological)
    const edges = [];
    const addedEdges = new Set();

    // Create spanning tree
    for (let i = 1; i < nodeCount; i++) {
      const source = Math.floor(Math.random() * i);
      const target = i;
      const edgeKey = isDirected 
        ? `${source}-${target}`
        : [source, target].sort((a, b) => a - b).join('-');
      
      addedEdges.add(edgeKey);
      edges.push({
        id: `e${edges.length}`,
        source,
        target,
        weight: isWeighted ? getEdgeWeight(algorithm) : 1
      });
    }

    // Add extra edges
    const extraEdges = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < extraEdges; i++) {
      if (edges.length >= (isDirected ? nodeCount*(nodeCount-1) : nodeCount*(nodeCount-1)/2)) break;
      
      let source, target, edgeKey;
      let attempts = 0;
      
      do {
        source = Math.floor(Math.random() * nodeCount);
        target = Math.floor(Math.random() * nodeCount);
        edgeKey = isDirected
          ? `${source}-${target}`
          : [source, target].sort((a, b) => a - b).join('-');
        attempts++;
      } while (
        (source === target || addedEdges.has(edgeKey)) && 
        attempts < 100
      );

      if (attempts >= 100) break;

      addedEdges.add(edgeKey);
      edges.push({
        id: `e${edges.length}`,
        source,
        target,
        weight: isWeighted ? getEdgeWeight(algorithm) : 1
      });
    }

    // Set source/destination nodes
    let sourceNode = null;
    let destinationNode = null;

    if (['dijkstra', 'bellman-ford'].includes(algorithm)) {
      sourceNode = Math.floor(Math.random() * nodeCount);
      do {
        destinationNode = Math.floor(Math.random() * nodeCount);
      } while (destinationNode === sourceNode);
    } else if (!['kruskal', 'prim', 'topological', 'cycle'].includes(algorithm)) {
      sourceNode = Math.floor(Math.random() * nodeCount);
    }

    return {
      newGraph: {
        nodes,
        edges,
        directed: isDirected,
        weighted: isWeighted
      },
      sourceNode,
      destinationNode,
      newArray: null,
      newTarget: null
    };
  }

  // Dynamic Programming algorithms
  if (category === 'dp') {
    switch(algorithm) {
      case 'fibonacci': {
        return {
          newArray: [Math.floor(Math.random() * 15) + 5],
          newTarget: null,
          newGraph: null,
          sourceNode: null,
          destinationNode: null
        };
      }
      case 'lcs': {
        const len1 = Math.floor(Math.random() * 8) + 3;
        const len2 = Math.floor(Math.random() * 8) + 3;
        const str1 = Array.from({length: len1}, () => 
          String.fromCharCode(97 + Math.floor(Math.random() * 4))
        ).join('');
        const str2 = Array.from({length: len2}, () => 
          String.fromCharCode(97 + Math.floor(Math.random() * 4))
        ).join('');
        return {
          newArray: [str1, str2],
          newTarget: null,
          newGraph: null,
          sourceNode: null,
          destinationNode: null
        };
      }
      case 'knapsack': {
        const weights = Array.from({length: 5}, () => Math.floor(Math.random() * 10) + 1);
        const values = Array.from({length: 5}, () => Math.floor(Math.random() * 20) + 5);
        const capacity = Math.floor(weights.reduce((a, b) => a + b, 0) * 0.7);
        return {
          newArray: [weights, values, capacity],
          newTarget: null,
          newGraph: null,
          sourceNode: null,
          destinationNode: null
        };
      }
      case 'lis': {
        const arrLength = Math.floor(Math.random() * 10) + 5;
        return {
          newArray: Array.from({length: arrLength}, () => Math.floor(Math.random() * 100) + 1),
          newTarget: null,
          newGraph: null,
          sourceNode: null,
          destinationNode: null
        };
      }
      case 'mcm': {
        const dims = Array.from({length: Math.floor(Math.random() * 5) + 4}, 
          () => Math.floor(Math.random() * 10) + 1
        );
        return {
          newArray: dims,
          newTarget: null,
          newGraph: null,
          sourceNode: null,
          destinationNode: null
        };
      }
      default: {
        return {
          newArray: [],
          newTarget: null,
          newGraph: null,
          sourceNode: null,
          destinationNode: null
        };
      }
    }
  }

  // Backtracking algorithms
  if (category === 'backtracking') {
    switch(algorithm) {
      case 'nqueens': {
        const boardSize = Math.floor(Math.random() * 3) + 4;
        return {
          newArray: [boardSize],
          newTarget: null,
          newGraph: null,
          sourceNode: null,
          destinationNode: null
        };
      }
      case 'sudoku': {
        const board = Array(9).fill().map(() => Array(9).fill(0));
        const numToAdd = Math.floor(Math.random() * 6) + 10;
        for (let i = 0; i < numToAdd; i++) {
          const row = Math.floor(Math.random() * 9);
          const col = Math.floor(Math.random() * 9);
          const num = Math.floor(Math.random() * 9) + 1;
          board[row][col] = num;
        }
        return {
          newArray: board,
          newTarget: null,
          newGraph: null,
          sourceNode: null,
          destinationNode: null
        };
      }
      case 'ratmaze': {
        const mazeSize = Math.floor(Math.random() * 3) + 5;
        const maze = Array(mazeSize).fill().map(() => 
          Array(mazeSize).fill().map(() => 
            Math.random() > 0.3 ? 0 : 1
          )
        );
        maze[0][0] = 0;
        maze[mazeSize-1][mazeSize-1] = 0;
        return {
          newArray: maze,
          newTarget: null,
          newGraph: null,
          sourceNode: null,
          destinationNode: null
        };
      }
      case 'subsetsum': {
        const setSize = Math.floor(Math.random() * 6) + 5;
        const numbers = Array.from({length: setSize}, () => Math.floor(Math.random() * 20) + 1);
        const sum = Math.floor(numbers.reduce((a, b) => a + b, 0) * 0.5);
        return {
          newArray: [numbers, sum],
          newTarget: null,
          newGraph: null,
          sourceNode: null,
          destinationNode: null
        };
      }
      default: {
        return {
          newArray: [],
          newTarget: null,
          newGraph: null,
          sourceNode: null,
          destinationNode: null
        };
      }
    }
  }

  // Array-based algorithms (searching/sorting)
  const size = Math.floor(Math.random() * 15) + 5;
  let newArray = [];
  let newTarget = null;

  if (algorithm === 'binary-search') {
    newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1)
      .sort((a, b) => a - b);
    newTarget = newArray[Math.floor(Math.random() * newArray.length)];
  } else if (category === 'sorting') {
    newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  } else {
    newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    newTarget = newArray[Math.floor(Math.random() * newArray.length)];
  }

  return {
    newArray,
    newTarget,
    newGraph: null,
    sourceNode: null,
    destinationNode: null
  };
};