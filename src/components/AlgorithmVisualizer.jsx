import React, { useEffect, useRef } from 'react';
import TreeVisualizer from './TreeVisualizer';
import DPVisualizer from './DpVisualizer';
import BacktrackingVisualizer from './BacktrackingVisualizer';

const AlgorithmVisualizer = ({
  algorithm = '',
  category = '',
  array = [],
  graph = {},
  target = undefined,
  state = {},
  error = null,
  inputValue = null
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (['tree', 'dp', 'backtracking'].includes(category)) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (category === 'graph') {
      drawGraphVisualization(ctx, width, height, graph, state);
    } else if (['searching', 'sorting'].includes(category)) {
      const currentArray = state?.array || array;
      drawArrayVisualization(ctx, width, height, currentArray, state, algorithm);
    } else {
      drawDefaultVisualization(ctx, width, height);
    }
  }, [algorithm, category, array, graph, target, state]);

  const drawGraphVisualization = (ctx, width, height, graph, state) => {
    if (!graph?.nodes || !graph?.edges) return;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    const padding = 50;
    const availableWidth = width - 2 * padding;
    const availableHeight = height - 2 * padding;

    // Calculate scaling factors
    const minX = Math.min(...graph.nodes.map(n => n.x));
    const maxX = Math.max(...graph.nodes.map(n => n.x));
    const minY = Math.min(...graph.nodes.map(n => n.y));
    const maxY = Math.max(...graph.nodes.map(n => n.y));

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;

    const scaleX = availableWidth / Math.max(graphWidth, 1);
    const scaleY = availableHeight / Math.max(graphHeight, 1);
    const scale = Math.min(scaleX, scaleY, 1);

    const offsetX = padding + (availableWidth - graphWidth * scale) / 2;
    const offsetY = padding + (availableHeight - graphHeight * scale) / 2;

    // Transform node positions to fit canvas
    const transformNode = (node) => ({
      ...node,
      x: (node.x - minX) * scale + offsetX,
      y: (node.y - minY) * scale + offsetY
    });

    const transformedNodes = graph.nodes.map(transformNode);

    // Draw edges
    graph.edges.forEach(edge => {
      const sourceNode = transformedNodes[edge.source];
      const targetNode = transformedNodes[edge.target];
      if (!sourceNode || !targetNode) return;

      ctx.strokeStyle = state?.path?.includes(edge.id)
        ? '#3B82F6'
        : state?.visitedEdges?.includes(edge.id)
        ? '#10B981'
        : '#4B5563';

      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.stroke();

      // Draw arrow for directed graphs
      if (graph.directed) {
        const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
        const arrowSize = 10;
        const arrowX = targetNode.x - 22 * Math.cos(angle);
        const arrowY = targetNode.y - 22 * Math.sin(angle);

        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
          arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
          arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }

      // Draw edge weights
      if (graph.weighted) {
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;

        ctx.fillStyle = '#1F2937';
        ctx.fillRect(midX - 15, midY - 10, 30, 20);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(edge.weight, midX, midY + 6);
      }
    });

    // Draw nodes
    transformedNodes.forEach(node => {
      // Determine node color based on state
      let nodeColor = '#EF4444';
      if (state?.currentNode === node.id) nodeColor = '#F59E0B';
      else if (state?.path?.includes(node.id)) nodeColor = '#3B82F6';
      else if (state?.visitedNodes?.includes(node.id)) nodeColor = '#10B981';

      // Draw node circle
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 24, 0, Math.PI * 2);
      ctx.fill();

      // Draw node border
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);

      // Draw visit order number if applicable
      if (state?.visitedNodes?.includes(node.id) && state?.visitOrder) {
        const visitIndex = state.visitOrder.indexOf(node.id);
        if (visitIndex !== -1) {
          ctx.fillStyle = '#F59E0B';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(visitIndex + 1, node.x, node.y + 35);
        }
      }

      // Draw distance if applicable
      if (state?.distances && state.distances[node.id] !== Infinity) {
        ctx.fillStyle = '#F3F4F6';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(state.distances[node.id], node.x, node.y - 35);
      }
    });

    // Draw queue/stack visualization
    const queueOrStack = state?.queue || state?.stack;
    const queueOrStackLabel = state?.queue ? 'Queue:' : state?.stack ? 'Stack:' : null;

    if (queueOrStack?.length) {
      ctx.fillStyle = 'rgba(31, 41, 55, 0.85)';
      ctx.fillRect(20, 20, 180, 50 + queueOrStack.length * 30);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(queueOrStackLabel, 35, 45);

      queueOrStack.forEach((item, i) => {
        const label =
          typeof item === 'object'
            ? `${transformedNodes[item.node]?.label || '?'} (${item.dist})`
            : transformedNodes[item]?.label || '?';

        ctx.fillText(`• ${label}`, 40, 80 + i * 30);
      });
    }

    // Draw visit order info
    if (state?.visitOrder && state.visitOrder.length > 0) {
      ctx.fillStyle = 'rgba(31, 41, 55, 0.85)';
      ctx.fillRect(width - 200, height - 80, 190, 60);

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Visit Order:', width - 190, height - 65);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px sans-serif';
      ctx.fillText('Numbers show order of discovery', width - 190, height - 50);
      ctx.fillText(`Total visited: ${state.visitOrder.length}`, width - 190, height - 35);
    }

    // Draw status message
    if (state?.status) {
      ctx.fillStyle = 'rgba(31, 41, 55, 0.9)';
      ctx.fillRect(width - 350, 20, 340, 40);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(state.status, width - 340, 45);
    }
  };

  const drawArrayVisualization = (ctx, width, height, currentArray, state, algorithm) => {
    if (!Array.isArray(currentArray) || currentArray.length === 0) return;

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    const barWidth = Math.min(40, (width - 40) / currentArray.length);
    const maxVal = Math.max(...currentArray, 1);
    const scale = (height - 60) / maxVal;
    const startX = (width - barWidth * currentArray.length) / 2;

    currentArray.forEach((value, i) => {
      const barHeight = value * scale;
      const x = startX + i * barWidth;
      const y = height - barHeight - 30;

      // Determine bar color based on algorithm state
      let color = '#4B5563';
      if (state?.sortedIndices?.includes(i)) color = '#10B981';
      if (algorithm && algorithm.includes('search')) {
        if (state?.foundIndex === i) color = '#12e49eff';
        else if (state?.index === i) color = '#FBBF24';
        else if (algorithm === 'binary-search') {
          if (state?.mid === i) color = '#F59E0B';
          else if (state?.low === i || state?.high === i) color = '#3B82F6';
        }
        else if (state?.comparedIndices?.includes(i)) color = '#EF4444';
      }
      if (algorithm && algorithm.includes('sort')) {
        if (state?.pivotIndex === i) color = '#EC4899';
        else if (state?.minIndex === i) color = '#3B82F6';
        else if (state?.keyIndex === i) color = '#F59E0B';
        else if (state?.swappedIndices?.includes(i)) color = '#8B5CF6';
        else if (state?.comparedIndices?.includes(i)) color = '#EF4444';
      }

      // Draw the bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth - 2, barHeight);

      // Draw the value
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(value, x + barWidth / 2, y - 5);

      // Draw the index
      ctx.fillStyle = '#D1D5DB';
      ctx.font = '12px sans-serif';
      ctx.fillText(i, x + barWidth / 2, height - 10);
    });

    // Draw legend
    const addLegendItem = (color, label, y) => {
      ctx.fillStyle = color;
      ctx.fillRect(10, y, 12, 12);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, 28, y + 10);
    };

    let legendY = 20;
    const spacing = 18;

    if (algorithm && algorithm.includes('search')) {
      addLegendItem('#FBBF24', 'Current element', legendY); legendY += spacing;
      addLegendItem('#10B981', 'Found element', legendY); legendY += spacing;
      // addLegendItem('#EF4444', 'Compared element', legendY); legendY += spacing;
      if (algorithm === 'binary-search') {
        addLegendItem('#3B82F6', 'Low/High bounds', legendY); legendY += spacing;
      }
    }

    if (algorithm && algorithm.includes('sort')) {
      addLegendItem('#EF4444', 'Compared element', legendY); legendY += spacing;
      addLegendItem('#8B5CF6', 'Swapped element', legendY); legendY += spacing;
      addLegendItem('#F59E0B', 'Key element', legendY); legendY += spacing;
      addLegendItem('#3B82F6', 'Min element', legendY); legendY += spacing;
      addLegendItem('#10B981', 'Sorted element', legendY); legendY += spacing;
      addLegendItem('#EC4899', 'Pivot element', legendY); legendY += spacing;
    }

    // Draw status message
    if (state?.status) {
      ctx.fillStyle = 'rgba(31, 41, 55, 0.9)';
      ctx.fillRect(width - 350, 20, 340, 40);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(state.status, width - 340, 45);
    }
  };

  const drawDefaultVisualization = (ctx, width, height) => {
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No visualization available', width / 2, height / 2);
  };

  return (
    <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 h-full">
      <h3 className="font-bold mb-3 text-xl text-center text-blue-400">
        {(typeof algorithm === 'string' && algorithm
          ? algorithm
              .split('-')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
          : 'Algorithm') + ' Visualization'}
      </h3>
      <div className="bg-gray-900 rounded-lg h-full flex items-center justify-center p-4">
        {error ? (
          <div className="text-red-500 text-center p-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : category === 'tree' ? (
          <TreeVisualizer state={state} />
        ) : category === 'dp' ? (
          <DPVisualizer state={{ ...state, fibN: inputValue }} />
        ) : category === 'backtracking' ? (
          <BacktrackingVisualizer 
            algorithm={algorithm}
            state={state} 
            input={array}
            target={target}
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="max-w-full max-h-full bg-gray-800 rounded"
          />
        )}
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;