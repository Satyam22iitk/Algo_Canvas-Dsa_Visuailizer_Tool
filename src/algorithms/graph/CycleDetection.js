// src/algorithms/graph/CycleDetection.js
import { initGraphState } from '../../utils/graph';

export default {
  name: "Cycle Detection",
  code: `bool hasCycle(Graph graph) {
  vector<bool> visited(graph.size(), false);
  
  for (int i = 0; i < graph.size(); i++) {
    if (!visited[i] && hasCycleUtil(i, visited, -1)) {
      return true;
    }
  }
  return false;
}

bool hasCycleUtil(int v, vector<bool>& visited, int parent) {
  visited[v] = true;
  
  for (int neighbor : graph[v]) {
    if (!visited[neighbor]) {
      if (hasCycleUtil(neighbor, visited, v))
        return true;
    } else if (neighbor != parent) {
      return true;
    }
  }
  return false;
}`,
  explanation: "Detects cycles in undirected graphs using DFS",
  complexity: {
    time: "O(V + E)",
    space: "O(V)"
  },
  visualize: (graph, startNode, speed, updateState, onComplete) => {
    // Store original graph for reset functionality
    const originalGraph = JSON.parse(JSON.stringify(graph));
    
    // Initialize state
    const initialState = { 
      ...initGraphState,
      stack: [{ node: startNode, parent: -1 }],
      visitedNodes: [startNode],
      status: `Starting DFS from ${graph.nodes[startNode].label}`
    };
    
    const steps = [initialState];
    const visited = new Set([startNode]);
    const visitedEdges = new Set();
    const parent = {};
    parent[startNode] = -1;
    
    // Explicit stack: [current node, parent, next neighbor index]
    const dfsStack = [[startNode, -1, 0]];
    let cycleFound = false;
    let cycleNodes = [];
    let cycleEdges = [];

    while (dfsStack.length > 0 && !cycleFound) {
      const [current, par, nextIdx] = dfsStack[dfsStack.length - 1];
      const neighbors = graph.edges
        .filter(e => 
          (e.source === current && e.target !== current) || 
          (!graph.directed && e.target === current && e.source !== current)
        )
        .map(e => e.source === current ? e.target : e.source);

      // Finished processing node
      if (nextIdx >= neighbors.length) {
        dfsStack.pop();
        steps.push({
          ...initialState,
          stack: dfsStack.map(([n, p]) => ({ node: n, parent: p })),
          visitedNodes: Array.from(visited),
          visitedEdges: Array.from(visitedEdges),
          currentNode: dfsStack.length > 0 ? dfsStack[dfsStack.length-1][0] : null,
          status: `Finished processing ${graph.nodes[current].label}`
        });
        continue;
      }

      // Process next neighbor
      const neighbor = neighbors[nextIdx];
      dfsStack[dfsStack.length - 1][2] = nextIdx + 1; // Update neighbor index

      // Find edge between current and neighbor
      const edge = graph.edges.find(e => 
        (e.source === current && e.target === neighbor) ||
        (e.source === neighbor && e.target === current)
      );

      // Step 1: Show edge being checked
      steps.push({
        ...initialState,
        stack: dfsStack.map(([n, p]) => ({ node: n, parent: p })),
        visitedNodes: Array.from(visited),
        visitedEdges: Array.from(visitedEdges),
        currentNode: current,
        currentEdge: edge?.id,
        status: `Checking edge to ${graph.nodes[neighbor].label}`
      });

      if (!visited.has(neighbor)) {
        // New node discovered
        visited.add(neighbor);
        parent[neighbor] = current;
        visitedEdges.add(edge.id);
        dfsStack.push([neighbor, current, 0]);

        // Step 2: Show move to new node
        steps.push({
          ...initialState,
          stack: dfsStack.map(([n, p]) => ({ node: n, parent: p })),
          visitedNodes: Array.from(visited),
          visitedEdges: Array.from(visitedEdges),
          currentNode: neighbor,
          currentEdge: null,
          status: `Visiting ${graph.nodes[neighbor].label}`
        });
      } else if (neighbor !== par) {
        // Cycle detected!
        visitedEdges.add(edge.id);
        cycleFound = true;
        
        // Reconstruct full cycle path
        cycleNodes = [current];
        cycleEdges = [edge.id];
        let temp = current;
        
        // Backtrack to find common ancestor
        while (temp !== neighbor) {
          const prev = parent[temp];
          const edgeId = graph.edges.find(e => 
            (e.source === temp && e.target === prev) ||
            (e.source === prev && e.target === temp)
          )?.id;
          
          if (edgeId) cycleEdges.push(edgeId);
          cycleNodes.push(prev);
          temp = prev;
        }
        
        // Step 3: Show cycle detection
        steps.push({
          ...initialState,
          stack: dfsStack.map(([n, p]) => ({ node: n, parent: p })),
          visitedNodes: Array.from(visited),
          visitedEdges: Array.from(visitedEdges),
          pathNodes: [...cycleNodes],
          pathEdges: [...cycleEdges],
          currentNode: current,
          currentEdge: edge.id,
          status: `🚨 Cycle detected! Path: ${cycleNodes.map(n => graph.nodes[n].label).join(' → ')}`
        });
      } else {
        // Skip parent edge
        steps.push({
          ...initialState,
          stack: dfsStack.map(([n, p]) => ({ node: n, parent: p })),
          visitedNodes: Array.from(visited),
          visitedEdges: Array.from(visitedEdges),
          currentNode: current,
          currentEdge: null,
          status: `Skipping parent edge`
        });
      }
    }

    // Final state
    const finalState = {
      ...initialState,
      stack: [],
      visitedNodes: Array.from(visited),
      visitedEdges: Array.from(visitedEdges),
      currentNode: null,
      currentEdge: null,
      status: cycleFound 
        ? `🚨 Cycle detected! Path: ${cycleNodes.map(n => graph.nodes[n].label).join(' → ')}` 
        : "✅ No cycles detected"
    };
    
    if (cycleFound) {
      finalState.pathNodes = [...cycleNodes];
      finalState.pathEdges = [...cycleEdges];
    }
    
    steps.push(finalState);

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
      }, 1800 / speed);
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