import React, { useEffect, useRef } from 'react';

const GraphVisualizer = ({ graph, state }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graph) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw graph visualization
    ctx.fillStyle = '#1F2937';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Graph Visualization', width/2, height/2 - 20);
    ctx.font = '16px sans-serif';
    ctx.fillText('Coming Soon', width/2, height/2 + 10);
    
    // Add more graph drawing logic here based on state
  }, [graph, state]);

  return (
    <div className="visualization-container">
      <canvas 
        ref={canvasRef}
        width={600}
        height={400}
        className="algorithm-canvas"
      />
      {state?.status && (
        <div className="status-message">
          {state.status}
        </div>
      )}
    </div>
  );
};

export default GraphVisualizer;