import React from 'react';
import { algorithmCategories } from '../utils/algorithmData';
import { graphAlgorithms } from '../utils/graph';

const LeftPanel = ({
  categories = algorithmCategories,
  selectedCategory,
  setSelectedCategory,
  selectedAlgorithm,
  setSelectedAlgorithm,
  array,
  setArray,
  target,
  setTarget,
  graph,
  setGraph,
  sourceNode,
  setSourceNode,
  destinationNode,
  setDestinationNode,
  generateRandomInput,
  isRunning,
  treeValues,
  setTreeValues,
  fibN,
  setFibN
}) => {
  const safeArray = Array.isArray(array) ? array : [];

  const handleArrayChange = (e) => {
    const input = e.target.value;
    const newArray = input
      .split(/[,\s]+/)
      .filter(x => x.trim() !== '')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    setArray(newArray);
  };

  const handleTreeValuesChange = (e) => {
    const input = e.target.value;
    const newValues = input
      .split(/[,\s]+/)
      .filter(x => x.trim() !== '')
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    setTreeValues(newValues);
  };

  const handleFibNChange = (e) => {
    const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), 20);
    setFibN(value);
  };

  const algoList = categories[selectedCategory]?.algorithms || [];

  return (
    <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
      {/* Category & Algorithm Select */}
      <div>
        <h2 className="font-bold mb-2 text-blue-400">Category</h2>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedAlgorithm(categories[e.target.value]?.algorithms?.[0]?.id ?? '');
          }}
          className="w-full bg-gray-700 p-2 rounded text-white mb-3"
          disabled={isRunning}
        >
          {Object.keys(categories || {}).map(category => (
            <option key={category} value={category}>
              {categories[category].name}
            </option>
          ))}
        </select>

        <h2 className="font-bold mb-2 text-blue-400">Algorithm</h2>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          className="w-full bg-gray-700 p-2 rounded text-white"
          disabled={isRunning || !algoList.length}
        >
          {algoList.map(algo => (
            <option key={algo.id} value={algo.id}>
              {algo.name || algo.label}
            </option>
          ))}
        </select>
      </div>

      {/* Input Section */}
      <div>
        <h2 className="font-bold mb-2 text-blue-400">Input</h2>
        <div className="space-y-3">
          {/* Fibonacci-specific input */}
          {selectedAlgorithm === 'fibonacci' && (
            <div>
              <label className="block text-sm mb-1">n (Fibonacci index):</label>
              <input
                type="number"
                value={fibN}
                onChange={handleFibNChange}
                className="w-full bg-gray-700 p-2 rounded text-white"
                disabled={isRunning}
                min="0"
                max="20"
              />
              <div className="text-xs text-gray-400 mt-1">
                Range: 0-20 (for visualization)
              </div>
            </div>
          )}

          {/* Array Inputs: Sorting/Searching */}
          {['sorting', 'searching'].includes(selectedCategory) && (
            <div>
              <label className="block text-sm mb-1">
                {selectedCategory === 'searching'
                  ? 'Array (comma/space separated):'
                  : 'Array to sort:'}
              </label>
              <input
                type="text"
                value={safeArray.join(', ')}
                onChange={handleArrayChange}
                className="w-full bg-gray-700 p-2 rounded text-white"
                disabled={isRunning}
                placeholder="e.g., 5, 2, 9, 1, 7"
              />
            </div>
          )}

          {/* Tree Input Field */}
          {selectedCategory === 'tree' && (
            <div>
              <label className="block text-sm mb-1">Tree Values (comma separated):</label>
              <input
                type="text"
                value={Array.isArray(treeValues) ? treeValues.join(', ') : ''}
                onChange={handleTreeValuesChange}
                className="w-full bg-gray-700 p-2 rounded text-white"
                disabled={isRunning}
                placeholder="e.g., 10, 20, 30"
              />
            </div>
          )}

          {/* Target Input */}
          {categories[selectedCategory]?.hasTarget && selectedAlgorithm !== 'fibonacci' && (
            <div>
              <label className="block text-sm mb-1">Target:</label>
              <input
                type="number"
                value={target ?? ''}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full bg-gray-700 p-2 rounded text-white"
                disabled={isRunning}
              />
            </div>
          )}

          {/* Graph Inputs */}
          {selectedCategory === 'graph' && (
            <div className="space-y-3">
              {graphAlgorithms[selectedAlgorithm] && (
                <div className="text-sm bg-blue-900 p-2 rounded">
                  <p className="font-semibold text-blue-200">Requirements:</p>
                  <p>Directed: {graphAlgorithms[selectedAlgorithm].directed ? 'Yes' : 'No'}</p>
                  <p>Weighted: {graphAlgorithms[selectedAlgorithm].weighted ? 'Yes' : 'No'}</p>
                </div>
              )}

              {(selectedAlgorithm === 'bfs' || selectedAlgorithm === 'dfs' ||
                selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'bellman-ford') && (
                <div>
                  <label className="block text-sm mb-1">Source Node:</label>
                  <select
                    value={sourceNode}
                    onChange={(e) => setSourceNode(Number(e.target.value))}
                    className="w-full bg-gray-700 p-2 rounded text-white"
                    disabled={isRunning}
                  >
                    {(graph?.nodes || []).map((node, i) => (
                      <option key={i} value={i}>
                        {node.label} (Node {i})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'bellman-ford') && (
                <div>
                  <label className="block text-sm mb-1">Destination Node:</label>
                  <select
                    value={destinationNode}
                    onChange={(e) => setDestinationNode(Number(e.target.value))}
                    className="w-full bg-gray-700 p-2 rounded text-white"
                    disabled={isRunning}
                  >
                    {(graph?.nodes || []).map((node, i) => (
                      <option key={i} value={i}>
                        {node.label} (Node {i})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2">
                <div className="text-sm bg-gray-900 p-2 rounded flex-1">
                  <p>Nodes: {graph?.nodes?.length || 0}</p>
                  <p>Edges: {graph?.edges?.length || 0}</p>
                </div>
                <div className="text-sm bg-gray-900 p-2 rounded flex-1">
                  <p>Directed: {graph?.directed ? 'Yes' : 'No'}</p>
                  <p>Weighted: {graph?.weighted ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {graphAlgorithms[selectedAlgorithm] &&
                (
                  (graphAlgorithms[selectedAlgorithm].directed && !graph?.directed) ||
                  (graphAlgorithms[selectedAlgorithm].weighted && !graph?.weighted)
                ) ? (
                <div className="text-sm bg-yellow-900 p-2 rounded">
                  <p className="font-semibold text-yellow-200">⚠️ Warning:</p>
                  <p>Current graph doesn't match algorithm requirements.</p>
                  <p>Click "Generate New Graph" to create a compatible graph.</p>
                </div>
              ) : graphAlgorithms[selectedAlgorithm] ? (
                <div className="text-sm bg-green-900 p-2 rounded">
                  <p className="font-semibold text-green-200">✅ Compatible:</p>
                  <p>Graph matches algorithm requirements.</p>
                </div>
              ) : null}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={generateRandomInput}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded font-medium"
            disabled={isRunning}
          >
            {selectedAlgorithm === 'fibonacci'
              ? 'Generate Random n'
              : selectedCategory === 'graph'
                ? 'Generate New Graph'
                : selectedCategory === 'tree'
                  ? 'Generate Random Tree'
                  : 'Generate Random Input'}
          </button>
        </div>
      </div>

      {/* Status Panel */}
      <div className="text-sm text-gray-300 p-2 bg-gray-900 rounded">
        {selectedAlgorithm === 'fibonacci' ? (
          <>
            <p>Max n: 20 (for visualization)</p>
            <p>Current n: {fibN}</p>
            <p className="font-semibold text-purple-300">
              fib({fibN}) = {calculateFibonacci(fibN)}
            </p>
            <p className="mt-1 font-semibold">Status: {isRunning ? 'Visualizing...' : 'Ready'}</p>
          </>
        ) : selectedCategory === 'graph' ? (
          <>
            <p>Max Nodes: 12</p>
            <p>Max Edges: 28</p>
            {graphAlgorithms[selectedAlgorithm] && (
              <>
                <p className="mt-2 text-blue-300">
                  Algorithm: {graphAlgorithms[selectedAlgorithm].name}
                </p>
                <p className="text-xs text-gray-400">
                  {graphAlgorithms[selectedAlgorithm].directed ? 'Directed' : 'Undirected'} •
                  {graphAlgorithms[selectedAlgorithm].weighted ? ' Weighted' : ' Unweighted'}
                </p>
              </>
            )}
          </>
        ) : selectedCategory === 'tree' ? (
          <>
            <p>Max Levels: 4 (for visualization)</p>
            <p>Node Values: 10–99</p>
            <p className="mt-2">
              Algorithm: {algoList.find(a => a.id === selectedAlgorithm)?.name || 'N/A'}
            </p>
          </>
        ) : (
          <>
    
          </>
        )}
        <p className="mt-1 font-semibold">Status: {isRunning ? 'Visualizing...' : 'Ready'}</p>
      </div>

      {/* Instructions Section */}
      <div className="bg-gray-900 p-4 rounded-lg border border-blue-800">
        <h3 className="text-lg font-bold text-blue-400 mb-3 text-center">How to Use</h3>
        <ol className="space-y-3 text-sm">
          <li className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
            <span className="text-gray-200">Select an algorithm from the dropdown above</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
            <span className="text-gray-200">
              {selectedCategory === 'graph' 
                ? 'Generate a new graph to match the algorithm requirements'
                : selectedCategory === 'tree'
                  ? 'Generate a random tree'
                  : 'Generate random input'}
            </span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
            <span className="text-gray-200">Run the algorithm from the bottom panel</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

// Helper function to calculate Fibonacci (for status display)
function calculateFibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

export default LeftPanel;