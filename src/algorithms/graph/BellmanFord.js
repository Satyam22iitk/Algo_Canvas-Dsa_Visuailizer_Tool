// src/algorithms/graph/BellmanFord.js
import { initGraphState } from '../../utils/graph';

export default {
  name: "Bellman-Ford Algorithm",
  code: `void bellmanFord(Graph graph, int source, int destination) {
  vector<int> dist(graph.size(), INF);
  vector<int> prev(graph.size(), -1);
  dist[source] = 0;
  
  // Relax all edges |V| - 1 times
  for (int i = 0; i < graph.size() - 1; i++) {
    for (Edge edge : graph.edges) {
      if (dist[edge.src] != INF && 
          dist[edge.src] + edge.weight < dist[edge.dest]) {
        dist[edge.dest] = dist[edge.src] + edge.weight;
        prev[edge.dest] = edge.src;
      }
    }
  }
  
  // Check for negative cycles
  for (Edge edge : graph.edges) {
    if (dist[edge.src] != INF && 
        dist[edge.src] + edge.weight < dist[edge.dest]) {
      // Negative cycle detected
      return;
    }
  }
  
  // Reconstruct path if no negative cycle
  if (dist[destination] != INF) {
    // Path reconstruction code
  }
}`,
  explanation: "Finds shortest path from a source to destination in graphs with negative weights (no negative cycles). Detects negative weight cycles if present.",
  complexity: {
    time: "O(VE)",
    space: "O(V)"
  },
  visualize: (graph, startNode, destinationNode, speed, updateState, onComplete) => {
    const steps = [];
    const distances = {};
    const visitedEdges = new Set();
    const prev = {};
    let hasNegativeCycle = false;
    let negativeEdge = null;
    const originalGraph = JSON.parse(JSON.stringify(graph));
    
    // Initialize distances
    graph.nodes.forEach((_, i) => {
      distances[i] = i === startNode ? 0 : Infinity;
      prev[i] = undefined;
    });

    // Initial state
    steps.push({
      ...initGraphState,
      distances: { ...distances },
      visitedEdges: [...visitedEdges],
      status: `Initializing distances. Starting node ${graph.nodes[startNode].label} = 0, others = ∞`
    });

    // Main relaxation loop
    for (let i = 0; i < graph.nodes.length - 1; i++) {
      let updated = false;
      
      steps.push({
        distances: { ...distances },
        visitedEdges: [...visitedEdges],
        status: `Starting iteration ${i + 1}/${graph.nodes.length - 1}`
      });

      graph.edges.forEach(edge => {
        const u = edge.source;
        const v = edge.target;
        const weight = edge.weight;

        // Relaxation step
        if (distances[u] < Infinity && distances[u] + weight < distances[v]) {
          const oldDistance = distances[v];
          distances[v] = distances[u] + weight;
          prev[v] = u;
          updated = true;
          visitedEdges.add(edge.id);

          steps.push({
            distances: { ...distances },
            visitedEdges: [...visitedEdges],
            status: `Relaxed edge ${edge.id}: ${graph.nodes[u].label}→${graph.nodes[v].label}\n` +
                   `Updated ${graph.nodes[v].label} from ${oldDistance} to ${distances[v]}`
          });
        }
      });

      if (!updated) {
        steps.push({
          distances: { ...distances },
          visitedEdges: [...visitedEdges],
          status: `No updates in iteration ${i + 1}, terminating early`
        });
        break;
      }
    }

    // Negative cycle detection
    steps.push({
      distances: { ...distances },
      visitedEdges: [...visitedEdges],
      status: "Checking for negative weight cycles..."
    });

    for (const edge of graph.edges) {
      const u = edge.source;
      const v = edge.target;
      const weight = edge.weight;

      if (distances[u] < Infinity && distances[u] + weight < distances[v]) {
        hasNegativeCycle = true;
        negativeEdge = edge;
        visitedEdges.add(edge.id);
        break;
      }
    }

    if (hasNegativeCycle) {
      steps.push({
        distances: { ...distances },
        visitedEdges: [...visitedEdges],
        status: `❌ Negative cycle detected at edge ${negativeEdge.id}: ` +
               `${graph.nodes[negativeEdge.source].label}→${graph.nodes[negativeEdge.target].label}\n` +
               `Can infinitely reduce distance to ${graph.nodes[negativeEdge.target].label}`
      });
    } else if (distances[destinationNode] === Infinity) {
      steps.push({
        distances: { ...distances },
        visitedEdges: [...visitedEdges],
        status: `Node ${graph.nodes[destinationNode].label} is unreachable from ${graph.nodes[startNode].label}`
      });
    } else {
      // Reconstruct path
      const path = [];
      const pathEdges = [];
      let current = destinationNode;

      while (current !== undefined && current !== null) {
        path.unshift(current);
        const parent = prev[current];
        if (parent !== undefined) {
          const edge = graph.edges.find(e => 
            e.source === parent && e.target === current
          );
          if (edge) pathEdges.unshift(edge.id);
        }
        current = parent;
      }

      steps.push({
        distances: { ...distances },
        visitedEdges: [...visitedEdges],
        path: pathEdges,
        status: `✅ Shortest path found!\n` +
               `Total distance to ${graph.nodes[destinationNode].label}: ${distances[destinationNode]}\n` +
               `Path: ${path.map(n => graph.nodes[n].label).join(' → ')}`
      });
    }

    // Visualization control
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
      stepIndex = 0;
      isPaused = false;
      isStopped = false;
      isFinished = false;
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