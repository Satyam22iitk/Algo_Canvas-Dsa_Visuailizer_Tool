import { initGraphState } from '../../utils/graph';

export default {
  name: "Kruskal's MST",
  code: `void kruskalMST(Graph graph) {
  sort(edges.begin(), edges.end(), compareWeight);
  DisjointSet ds(graph.size());
  vector<Edge> mst;
  
  for (Edge edge : edges) {
    if (ds.find(edge.src) != ds.find(edge.dest)) {
      mst.push_back(edge);
      ds.union(edge.src, edge.dest);
      if (mst.size() == graph.size() - 1) break;
    }
  }
}`,
  explanation: "Finds a minimum spanning tree by greedily adding smallest edges without cycles",
  complexity: {
    time: "O(E log E)",
    space: "O(V)"
  },
  visualize: (graph, startNode, speed, updateState, onComplete) => {
    // Store original graph for reset functionality
    const originalGraph = JSON.parse(JSON.stringify(graph));
    
    // Initialize edge colors to gray
    const initialEdgeColors = {};
    originalGraph.edges.forEach(edge => {
      initialEdgeColors[edge.id] = 'gray';
    });
    
    let state = { 
      ...initGraphState, 
      mstEdges: [],
      edgeColors: initialEdgeColors,
      status: "Initializing: Sorting edges by weight"
    };
    
    let steps = [];
    let edges = [];
    let parent = [];
    let mstWeight = 0;
    let edgeCount = 0;
    let stepIndex = 0;
    let intervalId = null;
    
    let isPaused = false;
    let isStopped = false;
    let isFinished = false;
    
    // Control functions
    const pause = () => { isPaused = true; };
    const resume = () => {
      if (isPaused && !isFinished) {
        isPaused = false;
        runVisualization();
      }
    };
    const stop = () => {
      isStopped = true;
      clearInterval(intervalId);
    };
    const reset = () => {
      isStopped = true;
      isFinished = false;
      clearInterval(intervalId);
      
      // Reset all variables
      graph = JSON.parse(JSON.stringify(originalGraph));
      state = { 
        ...initGraphState, 
        mstEdges: [],
        edgeColors: initialEdgeColors,
        status: "🔄 Reset to initial state" 
      };
      steps = [];
      edges = [];
      parent = [];
      mstWeight = 0;
      edgeCount = 0;
      stepIndex = 0;
      
      updateState(state);
    };
    
    // Disjoint set functions
    const find = (i) => {
      while (parent[i] !== -1) i = parent[i];
      return i;
    };
    
    const union = (x, y) => {
      if (x !== y) {
        parent[x] = y;
        return true;
      }
      return false;
    };
    
    // Pre-process steps
    const prepareSteps = () => {
      edges = [...graph.edges].sort((a, b) => a.weight - b.weight);
      parent = Array(graph.nodes.length).fill(-1);
      
      let currentState = {
        ...state,
        status: "Starting algorithm..."
      };
      steps.push(currentState);
      
      mstWeight = 0;
      edgeCount = 0;

      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];

        // Step 1: Mark edge as green (considering)
        let nextState = {
          ...currentState,
          currentEdge: edge.id,
          status: `Considering edge ${edge.id} (${edge.weight}) between ${graph.nodes[edge.source].label} and ${graph.nodes[edge.target].label}`,
          edgeColors: {
            ...currentState.edgeColors,
            [edge.id]: 'green'
          }
        };
        steps.push(nextState);

        const rootX = find(edge.source);
        const rootY = find(edge.target);
        
        if (rootX !== rootY) {
          // Step 2: Mark as blue when added to MST
          nextState = {
            ...nextState,
            mstEdges: [...nextState.mstEdges, edge.id],
            status: `✅ Added to MST (Total weight: ${mstWeight + edge.weight})`,
            edgeColors: {
              ...nextState.edgeColors,
              [edge.id]: 'blue'
            }
          };
          steps.push(nextState);
          
          union(rootX, rootY);
          mstWeight += edge.weight;
          edgeCount++;
          currentState = nextState;
          
          // Early termination when MST is complete
          if (edgeCount === graph.nodes.length - 1) break;
        } else {
          // Step 3: Mark as red when skipped (cycle)
          nextState = {
            ...nextState,
            status: "⛔ Skipped (would create cycle)",
            edgeColors: {
              ...nextState.edgeColors,
              [edge.id]: 'red'
            }
          };
          steps.push(nextState);
          currentState = nextState;
        }
      }
      
      // Final state - highlight MST in blue
      const finalState = {
        ...currentState,
        status: `✅ MST complete! Total weight: ${mstWeight}`,
        currentEdge: null
      };
      steps.push(finalState);
    };
    
    // Run visualization
    const runVisualization = () => {
      if (isStopped || isFinished) return;
      
      intervalId = setInterval(() => {
        if (isPaused) return;
        
        if (stepIndex >= steps.length) {
          clearInterval(intervalId);
          isFinished = true;
          onComplete();
          return;
        }
        
        updateState(steps[stepIndex]);
        stepIndex++;
      }, 1800 / speed);
    };
    
    // Initialize
    prepareSteps();
    runVisualization();
    
    return { pause, resume, stop, reset };
  }
};