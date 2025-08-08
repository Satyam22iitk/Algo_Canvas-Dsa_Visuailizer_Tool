// src/components/GraphVisualizer.jsx
import { useEffect, useRef } from 'react';

const GraphVisualizer = ({ nodes, edges, currentNode, visitedNodes }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Layout nodes in a circle
    const radius = 200;
    const centerX = width / 2;
    const centerY = height / 2;

    const nodePositions = nodes.map((_, i) => {
      const angle = (2 * Math.PI * i) / nodes.length;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    // Draw edges
    ctx.strokeStyle = '#4ade80'; // Green
    ctx.lineWidth = 2;
    edges.forEach(([from, to]) => {
      const p1 = nodePositions[from];
      const p2 = nodePositions[to];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach((label, i) => {
      const { x, y } = nodePositions[i];
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = visitedNodes.includes(i)
        ? '#60a5fa' // visited - blue
        : i === currentNode
        ? '#facc15' // current - yellow
        : '#e2e8f0'; // default - gray
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();

      // Draw labels
      ctx.fillStyle = '#0f172a';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    });
  }, [nodes, edges, currentNode, visitedNodes]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="bg-slate-800 rounded-xl shadow-inner"
    />
  );
};

export default GraphVisualizer;
