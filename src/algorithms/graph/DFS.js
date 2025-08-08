import { initGraphState } from '../../utils/graph';

export default {
  name: "Depth-First Search",
  code: `void DFS(Graph graph, int node) {
  visited[node] = true;
  
  for (int neighbor : graph[node]) {
    if (!visited[neighbor]) {
      DFS(graph, neighbor);
    }
  }
}`,
  explanation: "Explores as far as possible along each branch before backtracking",
  complexity: {
    time: "O(V + E)",
    space: "O(V)"
  },
  visualize: (graph, startNode, speed, updateState, onComplete) => {
    // Store original graph for reset functionality
    const originalGraph = JSON.parse(JSON.stringify(graph));
    
    const steps = [];
    const visited = new Set();
    const visitedEdges = new Set();
    const stack = [startNode];
    const visitOrder = [];
    
    // Build adjacency list for more efficient neighbor lookup
    const adjList = {};
    graph.nodes.forEach((_, i) => adjList[i] = []);
    graph.edges.forEach(edge => {
      adjList[edge.source].push({ node: edge.target, edgeId: edge.id });
      if (!graph.directed) {
        adjList[edge.target].push({ node: edge.source, edgeId: edge.id });
      }
    });

    // Initial state - show starting node in stack
    steps.push({
      ...initGraphState,
      stack: [...stack],
      visitedNodes: [...visited],
      visitedEdges: [...visitedEdges],
      visitOrder: [...visitOrder],
      currentNode: null,
      status: `Initializing DFS from node ${graph.nodes[startNode].label}`
    });

    while (stack.length > 0) {
      const node = stack.pop();
      
      if (!visited.has(node)) {
        // Mark node as visited
        visited.add(node);
        visitOrder.push(node);
        
        // Show node being visited
        steps.push({
          stack: [...stack],
          visitedNodes: [...visited],
          visitedEdges: [...visitedEdges],
          visitOrder: [...visitOrder],
          currentNode: node,
          status: `Processing node ${graph.nodes[node].label} (Visit #${visitOrder.length})`
        });

        // Get neighbors in reverse order for correct processing order
        const neighbors = [...adjList[node]].reverse();
        
        for (const { node: neighbor, edgeId } of neighbors) {
          // Only mark edge as visited when actually traversing to an unvisited node
          if (!visited.has(neighbor)) {
            visitedEdges.add(edgeId);
            stack.push(neighbor);
            
            steps.push({
              stack: [...stack],
              visitedNodes: [...visited],
              visitedEdges: [...visitedEdges],
              visitOrder: [...visitOrder],
              currentNode: node,
              status: `Discovered unvisited neighbor ${graph.nodes[neighbor].label}, adding to stack`
            });
          } else {
            steps.push({
              stack: [...stack],
              visitedNodes: [...visited],
              visitedEdges: [...visitedEdges],
              visitOrder: [...visitOrder],
              currentNode: node,
              status: `Found already visited neighbor ${graph.nodes[neighbor].label} (edge ${edgeId})`
            });
          }
        }
      }
    }
    
    // Final state
    steps.push({
      visitedNodes: [...visited],
      visitedEdges: [...visitedEdges],
      visitOrder: [...visitOrder],
      currentNode: null,
      status: `✅ DFS completed. Visited ${visited.size}/${graph.nodes.length} nodes`
    });
    
    // Visualization control variables
    let stepIndex = 0;
    let isPaused = false;
    let isStopped = false;
    let isFinished = false;
    let intervalId = null;
    
    const playStep = () => {
      if (stepIndex >= steps.length) {
        isFinished = true;
        clearInterval(intervalId);
        onComplete();
        return;
      }
      
      updateState(steps[stepIndex]);
      stepIndex++;
    };
    
    const startVisualization = () => {
      intervalId = setInterval(() => {
        if (!isPaused && !isStopped) {
          playStep();
        }
      }, 2000 / speed);
    };
    
    const pause = () => {
      isPaused = true;
      updateState({
        ...steps[stepIndex - 1],
        status: steps[stepIndex - 1].status + " (Paused)"
      });
    };
    
    const resume = () => {
      if (isPaused && !isFinished) {
        isPaused = false;
      }
    };
    
    const stop = () => {
      isStopped = true;
      clearInterval(intervalId);
      updateState({
        ...initGraphState,
        status: "Visualization stopped"
      });
    };
    
    const reset = () => {
      isStopped = true;
      clearInterval(intervalId);
      
      // Reset all variables
      stepIndex = 0;
      isPaused = false;
      isStopped = false;
      isFinished = false;
      
      // Restore original graph state
      Object.assign(graph, JSON.parse(JSON.stringify(originalGraph)));
      
      updateState({
        ...initGraphState,
        status: "🔄 Reset to initial state"
      });
    };
    
    startVisualization();
    
    return {
      pause,
      resume,
      stop,
      reset
    };
  }
};