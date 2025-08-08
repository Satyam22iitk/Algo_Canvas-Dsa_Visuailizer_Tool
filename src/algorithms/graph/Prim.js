// src/algorithms/graph/Prim.js
import { initGraphState } from '../../utils/graph';

export default {
  name: "Prim's MST",
  code: `void primMST(Graph graph) {
  priority_queue<Edge> pq;
  vector<int> key(graph.size(), INF);
  vector<bool> inMST(graph.size(), false);
  vector<int> parent(graph.size(), -1);
  
  key[0] = 0;
  pq.push({0, 0, 0});
  
  while (!pq.empty()) {
    int u = pq.top().dest; pq.pop();
    inMST[u] = true;
    
    for (Edge edge : graph[u]) {
      int v = edge.dest;
      int weight = edge.weight;
      if (!inMST[v] && weight < key[v]) {
        key[v] = weight;
        pq.push({v, key[v]});
        parent[v] = u;
      }
    }
  }
}`,
  explanation: "Grows minimum spanning tree from starting node by adding smallest connecting edges",
  complexity: {
    time: "O(E log V)",
    space: "O(V)"
  },
  visualize: (graph, startNode, speed, updateState, onComplete) => {
    const INF = Number.MAX_SAFE_INTEGER;
    const originalGraph = JSON.parse(JSON.stringify(graph));
    
    const state = { 
      ...initGraphState, 
      mstEdges: [],
      consideredEdges: [],
      distances: graph.nodes.map((_, i) => i === startNode ? 0 : INF),
      inMST: Array(graph.nodes.length).fill(false),
      status: `Starting from node ${graph.nodes[startNode].label}`
    };
    
    const steps = [state];
    const parent = Array(graph.nodes.length).fill(-1);
    const lastEdge = Array(graph.nodes.length).fill(null);
    let mstWeight = 0;
    
    // Priority queue simulation (min-heap)
    const pq = [];
    const addToPQ = (node, key) => {
      pq.push({node, key});
      pq.sort((a, b) => a.key - b.key);
    };
    
    // Start with initial node
    state.inMST[startNode] = true;
    state.status = `Added ${graph.nodes[startNode].label} to MST (key = 0)`;
    steps.push({...state});
    
    // Initialize with edges from start node
    graph.edges.forEach(edge => {
      if (edge.source === startNode || edge.target === startNode) {
        const neighbor = edge.source === startNode ? edge.target : edge.source;
        if (state.distances[neighbor] > edge.weight) {
          state.distances[neighbor] = edge.weight;
          parent[neighbor] = startNode;
          
          // Update last edge reference
          if (lastEdge[neighbor] !== null) {
            state.consideredEdges = state.consideredEdges.filter(id => id !== lastEdge[neighbor]);
          }
          lastEdge[neighbor] = edge.id;
          state.consideredEdges.push(edge.id);
          
          addToPQ(neighbor, edge.weight);
        }
      }
    });
    
    state.status = `Updated keys for neighbors of ${graph.nodes[startNode].label}`;
    steps.push({...state});
    
    // Main algorithm
    while (pq.length > 0) {
      const {node: u, key: minKey} = pq.shift();
      
      if (state.inMST[u]) continue;
      
      // Find the edge connecting u to MST
      const edgeToAdd = graph.edges.find(edge => 
        (edge.source === parent[u] && edge.target === u) ||
        (edge.source === u && edge.target === parent[u])
      );
      
      if (!edgeToAdd) continue;
      
      // Highlight current edge
      state.currentEdge = edgeToAdd.id;
      state.status = `Selected edge ${edgeToAdd.id} connecting ${graph.nodes[parent[u]].label} → ${graph.nodes[u].label} (weight: ${edgeToAdd.weight})`;
      steps.push({...state});
      
      // Remove from considered edges and add to MST
      state.consideredEdges = state.consideredEdges.filter(id => id !== edgeToAdd.id);
      state.mstEdges = [...state.mstEdges, edgeToAdd.id];
      state.inMST[u] = true;
      state.distances[u] = minKey;
      mstWeight += edgeToAdd.weight;
      
      state.status = `Added ${graph.nodes[u].label} to MST (key = ${minKey}, Total weight: ${mstWeight})`;
      state.currentEdge = null;
      steps.push({...state});
      
      // Update neighbors
      graph.edges.forEach(edge => {
        const v = edge.source === u ? edge.target : 
                 edge.target === u ? edge.source : -1;
        if (v === -1 || state.inMST[v]) return;
        
        if (edge.weight < state.distances[v]) {
          state.distances[v] = edge.weight;
          parent[v] = u;
          
          // Update considered edges
          if (lastEdge[v] !== null) {
            state.consideredEdges = state.consideredEdges.filter(id => id !== lastEdge[v]);
          }
          lastEdge[v] = edge.id;
          state.consideredEdges.push(edge.id);
          
          addToPQ(v, edge.weight);
        }
      });
      
      state.status = `Updated keys for neighbors of ${graph.nodes[u].label}`;
      steps.push({...state});
    }
    
    state.status = `✅ MST complete! Total weight: ${mstWeight}`;
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