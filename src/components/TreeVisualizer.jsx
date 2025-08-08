import React, { useRef } from 'react';

const TreeVisualizer = ({ state }) => {
  const { tree, visitedNodes = [], currentNode, status } = state || {};
  const svgRef = useRef(null);

  // Get tree depth - defined first
  const getTreeDepth = (node) => {
    if (!node) return 0;
    return 1 + Math.max(
      getTreeDepth(node.left),
      getTreeDepth(node.right)
    );
  };

  // Calculate tree dimensions - defined after getTreeDepth
  const calculateDimensions = () => {
    if (!tree) return { width: 800, height: 600 };
    
    const maxDepth = getTreeDepth(tree);
    const width = 800;
    const height = maxDepth * 100 + 100;
    return { width, height };
  };

  const { width, height } = calculateDimensions();
  
  // TreeNode component - defined last
  const TreeNode = ({ node, x, y, visited, current, level, parentCoords }) => {
    if (!node) return null;
    
    const isVisited = visited.includes(node.value);
    const isCurrent = current === node.value;
    
    return (
      <g>
        {/* Line connecting to parent */}
        {parentCoords && (
          <line
            x1={parentCoords.x}
            y1={parentCoords.y + 20}
            x2={x}
            y2={y - 20}
            stroke="#6B7280"
            strokeWidth="2"
          />
        )}
        
        {/* Node circle */}
        <circle
          cx={x}
          cy={y}
          r={20}
          fill={isVisited ? "#10B981" : "#1F2937"}
          stroke={isCurrent ? "#FBBF24" : "#3B82F6"}
          strokeWidth="2"
        />
        
        {/* Node value */}
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontWeight="bold"
          fontSize="14"
        >
          {node.value}
        </text>
        
        {/* Child nodes */}
        <g>
          {node.left && (
            <TreeNode 
              node={node.left} 
              x={x - 150 / Math.pow(1.5, level)} 
              y={y + 80}
              visited={visited}
              current={current}
              level={level + 1}
              parentCoords={{x, y}}
            />
          )}
          {node.right && (
            <TreeNode 
              node={node.right} 
              x={x + 150 / Math.pow(1.5, level)} 
              y={y + 80}
              visited={visited}
              current={current}
              level={level + 1}
              parentCoords={{x, y}}
            />
          )}
        </g>
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="mb-4 min-h-[40px]">
        <p className="text-lg font-semibold text-center text-blue-300">
          {status || 'Ready to visualize'}
        </p>
      </div>
      
      <div className="flex-1 w-full h-full overflow-auto flex items-center justify-center">
        {tree ? (
          <svg 
            ref={svgRef}
            width={width} 
            height={height}
            className="bg-gray-800 rounded-lg"
          >
            <TreeNode 
              node={tree} 
              x={width / 2} 
              y={50} 
              visited={visitedNodes} 
              current={currentNode?.value}
              level={1}
              parentCoords={null}
            />
          </svg>
        ) : (
          <div className="text-gray-500 italic p-4">
            Tree will be visualized here. Click "Generate Random Tree" to create a tree.
          </div>
        )}
      </div>
      
      {visitedNodes.length > 0 && (
        <div className="mt-4 p-2 bg-gray-800 rounded w-full">
          <p className="text-sm text-gray-300 mb-1">
            Traversal Path: {visitedNodes.join(' → ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default TreeVisualizer;