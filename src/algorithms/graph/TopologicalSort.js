// src/algorithms/graph/TopologicalSort.js
import { initGraphState } from '../../utils/graph';

export default {
  name: "Topological Sort",
  code: `void topologicalSort(Graph graph) {
  stack<int> stack;
  vector<bool> visited(graph.size(), false);
  
  for (int i = 0; i < graph.size(); i++) {
    if (!visited[i]) {
      topologicalSortUtil(i, visited, stack);
    }
  }
  
  while (!stack.empty()) {
    cout << stack.top() << " ";
    stack.pop();
  }
}

void topologicalSortUtil(int v, vector<bool>& visited, stack<int>& stack) {
  visited[v] = true;
  
  for (int neighbor : graph[v]) {
    if (!visited[neighbor]) {
      topologicalSortUtil(neighbor, visited, stack);
    }
  }
  
  stack.push(v);
}`,
  explanation: "Linear ordering of vertices in a DAG such that for every directed edge u→v, u comes before v",
  complexity: {
    time: "O(V + E)",
    space: "O(V)"
  },
  visualize: (graph, startNode, speed, updateState, onComplete) => {
    // Store original graph for reset functionality
    const originalGraph = JSON.parse(JSON.stringify(graph));
    
    if (!graph.directed) {
      updateState({
        ...initGraphState,
        status: "❌ Topological sort requires a directed acyclic graph (DAG)"
      });
      onComplete();
      return;
    }
    
    const state = { 
      ...initGraphState, 
      stack: [],
      order: [],
      status: "Initializing topological sort"
    };
    
    const steps = [state];
    const visited = new Set();
    const inDegree = Array(graph.nodes.length).fill(0);
    
    // Calculate in-degrees
    graph.edges.forEach(edge => {
      inDegree[edge.target]++;
    });
    
    // Initialize queue with nodes having 0 in-degree
    const queue = graph.nodes
      .map((_, i) => i)
      .filter(i => inDegree[i] === 0);
    
    state.queue = [...queue];
    state.status = `Found ${queue.length} nodes with no incoming edges`;
    steps.push({...state});
    
    while (queue.length > 0) {
      const node = queue.shift();
      visited.add(node);
      
      state.currentNode = node;
      state.visitedNodes = [...visited];
      state.order = [...state.order, node];
      state.status = `Processing node ${graph.nodes[node].label}`;
      steps.push({...state});
      
      // Process outgoing edges
      graph.edges
        .filter(e => e.source === node)
        .forEach(edge => {
          state.visitedEdges = [...(state.visitedEdges || []), edge.id];
          state.status = `Processing edge to ${graph.nodes[edge.target].label}`;
          steps.push({...state});
          
          inDegree[edge.target]--;
          if (inDegree[edge.target] === 0) {
            queue.push(edge.target);
            state.queue = [...queue];
            state.status = `Added ${graph.nodes[edge.target].label} to queue`;
            steps.push({...state});
          }
        });
    }
    
    if (state.order.length === graph.nodes.length) {
      const orderStr = state.order.map(i => graph.nodes[i].label).join(" → ");
      state.status = `✅ Topological order: ${orderStr}`;
    } else {
      state.status = "❌ Cycle detected! Not a DAG";
    }
    
    steps.push({...state});
    
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
      
      updateState({
        ...steps[stepIndex],
        visitedEdges: [
          ...(steps[stepIndex-1]?.visitedEdges || []),
          ...(steps[stepIndex].visitedEdges || [])
        ]
      });
      
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