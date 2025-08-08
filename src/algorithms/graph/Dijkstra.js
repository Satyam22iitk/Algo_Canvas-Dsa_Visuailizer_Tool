// src/algorithms/graph/Dijkstra.js
import { initGraphState } from '../../utils/graph';

export default {
  name: "Dijkstra's Algorithm",
  code: `void dijkstra(Graph graph, int source, int destination) {
  priority_queue<Node> pq;
  vector<int> dist(graph.size(), INF);
  vector<int> prev(graph.size(), -1);
  
  dist[source] = 0;
  pq.push({source, 0});
  
  while (!pq.empty()) {
    Node node = pq.top(); pq.pop();
    
    if (node.id == destination) break; // Early termination
    
    for (Edge edge : graph[node.id]) {
      int newDist = dist[node.id] + edge.weight;
      if (newDist < dist[edge.dest]) {
        dist[edge.dest] = newDist;
        prev[edge.dest] = node.id;
        pq.push({edge.dest, newDist});
      }
    }
  }
}`,
  explanation: "Finds shortest path from a source node to a specific destination node in weighted graphs with non-negative edges",
  complexity: {
    time: "O((V + E) log V)",
    space: "O(V)"
  },
  visualize: (graph, startNode, destinationNode, speed, updateState, onComplete) => {
    const steps = [];
    const distances = {};
    const visited = new Set();
    const visitedEdges = new Set();
    const queue = [{ node: startNode, dist: 0 }];
    const prev = {};
    
    // Initialize distances
    graph.nodes.forEach((_, i) => {
      distances[i] = i === startNode ? 0 : Infinity;
    });
    
    // Initial state
    steps.push({
      ...initGraphState,
      distances: { ...distances },
      queue: [...queue],
      visitedNodes: [...visited],
      visitedEdges: [...visitedEdges],
      status: `Starting Dijkstra from ${graph.nodes[startNode].label} to ${graph.nodes[destinationNode].label}`
    });
    
    while (queue.length > 0) {
      // Sort queue by distance (min first) - simulating priority queue
      queue.sort((a, b) => a.dist - b.dist);
      const { node, dist } = queue.shift();
      
      if (visited.has(node)) continue;
      visited.add(node);
      
      // Process current node
      steps.push({
        distances: { ...distances },
        queue: [...queue],
        visitedNodes: [...visited],
        visitedEdges: [...visitedEdges],
        currentNode: node,
        status: `Processing node ${graph.nodes[node].label} (distance: ${dist})`
      });
      
      // Early termination if we reached the destination
      if (node === destinationNode) {
        break;
      }
      
      // Find all outgoing edges from current node
      const neighbors = [];
      graph.edges.forEach(edge => {
        if (edge.source === node) {
          neighbors.push({ 
            node: edge.target, 
            edgeId: edge.id, 
            weight: edge.weight 
          });
        } else if (!graph.directed && edge.target === node) {
          neighbors.push({ 
            node: edge.source, 
            edgeId: edge.id, 
            weight: edge.weight 
          });
        }
      });
      
      // Process neighbors
      for (const { node: neighbor, edgeId, weight } of neighbors) {
        const newDist = distances[node] + weight;
        
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          prev[neighbor] = node;
          visitedEdges.add(edgeId);
          
          // Add to queue if not already visited
          if (!visited.has(neighbor)) {
            queue.push({ node: neighbor, dist: newDist });
          }
          
          steps.push({
            distances: { ...distances },
            queue: [...queue],
            visitedNodes: [...visited],
            visitedEdges: [...visitedEdges],
            status: `Updated ${graph.nodes[neighbor].label} distance to ${newDist} via ${graph.nodes[node].label}`
          });
        }
      }
    }
    
    // Reconstruct shortest path to destination
    const path = [];
    let current = destinationNode;
    const pathEdges = [];
    
    while (current !== undefined) {
      path.unshift(current);
      const parent = prev[current];
      if (parent !== undefined) {
        // Find the edge between parent and current
        const edge = graph.edges.find(e => 
          (e.source === parent && e.target === current) ||
          (!graph.directed && e.source === current && e.target === parent)
        );
        if (edge) {
          pathEdges.unshift(edge.id);
        }
      }
      current = parent;
    }
    
    // Final state with path
    steps.push({
      distances: { ...distances },
      visitedNodes: [...visited],
      visitedEdges: [...visitedEdges],
      path: pathEdges,
      status: `✅ Shortest path to ${graph.nodes[destinationNode].label}: ${distances[destinationNode]} (${path.map(n => graph.nodes[n].label).join(' → ')})`
    });
    
    // Visualize steps
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        onComplete();
        return;
      }
      
      updateState(steps[stepIndex]);
      stepIndex++;
    }, 1500 / speed);
  }
};