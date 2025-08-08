// src/algorithms/graph/BFS.js
import { initGraphState } from '../../utils/graph';

export default {
  name: "Breadth-First Search",
  code: `function BFS(graph, start) {
  // Create adjacency list
  const adjList = {};
  graph.nodes.forEach(node => {
    adjList[node.id] = [];
  });
  graph.edges.forEach(edge => {
    adjList[edge.source].push(edge.target);
    if (!graph.directed) {
      adjList[edge.target].push(edge.source);
    }
  });

  const queue = [start];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor of adjList[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
  explanation: "Explores graph layer by layer, visiting all neighbors before moving deeper",
  complexity: {
    time: "O(V + E)",
    space: "O(V)"
  },
  visualize: (graph, startNode, speed, updateState, onComplete) => {
    // Create mapping from node id to node object
    const nodeMap = {};
    graph.nodes.forEach(node => {
      nodeMap[node.id] = node;
    });

    const originalGraph = JSON.parse(JSON.stringify(graph));
    const steps = [];
    const visited = new Set([startNode]);
    const queue = [startNode];
    const visitedEdges = new Set();
    const visitOrder = [startNode];
    
    // Initial state
    steps.push({
      ...initGraphState,
      queue: [...queue],
      visitedNodes: [...visited],
      visitOrder: [...visitOrder],
      status: `Starting BFS from node ${nodeMap[startNode].label}`
    });
    
    while (queue.length > 0) {
      const node = queue.shift();
      
      // Find all neighbors
      const neighbors = [];
      graph.edges.forEach(edge => {
        if (edge.source === node) {
          neighbors.push({ node: edge.target, edgeId: edge.id });
        } else if (!graph.directed && edge.target === node) {
          neighbors.push({ node: edge.source, edgeId: edge.id });
        }
      });
      
      // Process neighbors
      for (const { node: neighbor, edgeId } of neighbors) {
        // Mark edge as visited
        visitedEdges.add(edgeId);
        
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          visitOrder.push(neighbor);
          
          steps.push({
            queue: [...queue],
            visitedNodes: [...visited],
            visitedEdges: [...visitedEdges],
            visitOrder: [...visitOrder],
            currentNode: node,
            status: `Discovered node ${nodeMap[neighbor].label} via edge ${edgeId} (Visit #${visitOrder.length})`
          });
        } else {
          steps.push({
            queue: [...queue],
            visitedNodes: [...visited],
            visitedEdges: [...visitedEdges],
            visitOrder: [...visitOrder],
            currentNode: node,
            status: `Explored edge ${edgeId} to already visited node ${nodeMap[neighbor].label}`
          });
        }
      }
    }
    
    // Final state
    steps.push({
      visitedNodes: [...visited],
      visitedEdges: [...visitedEdges],
      visitOrder: [...visitOrder],
      status: `✅ BFS completed. Visited ${visited.size} nodes`
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
      }, 1500 / speed);
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