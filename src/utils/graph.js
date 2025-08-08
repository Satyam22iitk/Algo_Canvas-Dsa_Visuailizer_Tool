// ...existing code...
export const graphAlgorithms = {
  bfs: {
    name: "Breadth-First Search (BFS)",
    directed: false,
    weighted: false,
    file: "BFS.js"
  },
  dfs: {
    name: "Depth-First Search (DFS)",
    directed: false,
    weighted: false,
    file: "DFS.js"
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    directed: false, // No (but supports)
    weighted: true,
    file: "Dijkstra.js"
  },
  "bellman-ford": {
    name: "Bellman-Ford",
    directed: true, // Yes (usually used)
    weighted: true,
    file: "BellmanFord.js"
  },
  kruskal: {
    name: "Kruskal's MST",
    directed: false,
    weighted: true,
    file: "Krushkal.js"
  },
  prim: {
    name: "Prim's MST",
    directed: false,
    weighted: true,
    file: "Prim.js"
  },
  topological: {
    name: "Topological Sort",
    directed: true,
    weighted: false,
    file: "TopologicalSort.js"
  },
  cycle: {
    name: "Cycle Detection",
    directed: false, // No (or true if for DAGs)
    weighted: false,
    file: "CycleDetection.js"
  }
};
// ...existing code...

// Initial state for graph visualization
export const initGraphState = {
  currentStep: 0,
  status: '',
  visitedNodes: [],
  visitedEdges: [],
  path: [],
  distances: {},
  queue: [],
  stack: [],
  matrix: [],
  low: {},
  discovery: {},
  parent: {}
};

// Generate a default graph (for initial state)
export const generateDefaultGraph = () => {
  const nodes = [
    { id: 0, label: 'A', x: 100, y: 100 },
    { id: 1, label: 'B', x: 300, y: 100 },
    { id: 2, label: 'C', x: 200, y: 250 },
    { id: 3, label: 'D', x: 100, y: 350 },
    { id: 4, label: 'E', x: 300, y: 350 }
  ];

  const edges = [
    { id: 'e0', source: 0, target: 1, weight: 4 },
    { id: 'e1', source: 0, target: 2, weight: 2 },
    { id: 'e2', source: 1, target: 2, weight: 5 },
    { id: 'e3', source: 1, target: 4, weight: 3 },
    { id: 'e4', source: 2, target: 3, weight: 7 },
    { id: 'e5', source: 3, target: 4, weight: 4 }
  ];

  // Auto-assign weight if missing (for dynamic cases)
  edges.forEach(edge => {
    edge.weight = edge.weight || Math.floor(Math.random() * 9) + 1;
  });

  return {
    nodes,
    edges,
    directed: false,
    weighted: true
  };
};
