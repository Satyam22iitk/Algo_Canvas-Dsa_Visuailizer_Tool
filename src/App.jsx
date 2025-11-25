import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import AlgorithmVisualizer from './components/AlgorithmVisualizer';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import BottomPanel from './components/BottomPanel';
import { algorithmCategories, generateRandomInput } from './utils/algorithmData';
import { generateDefaultGraph } from './utils/graph';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('searching');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('linear-search');

  // Array algorithm states
  const [array, setArray] = useState([19, 85, 36, 68, 31, 41, 29]);
  const [target, setTarget] = useState(41);

  // Graph algorithm states
  const [graph, setGraph] = useState(generateDefaultGraph());
  const [sourceNode, setSourceNode] = useState(0);
  const [destinationNode, setDestinationNode] = useState(1);

  // Tree algorithm states
  const [treeRoot, setTreeRoot] = useState(null);
  const [treeValues, setTreeValues] = useState([10, 20, 30, 40, 50, 60, 70]);

  // DP algorithm states
  const [fibN, setFibN] = useState(5); // Fibonacci sequence input

  // Visualization states
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [visualizationState, setVisualizationState] = useState(null);
  const [algorithmData, setAlgorithmData] = useState(null);
  const [error, setError] = useState(null);
   
  // Ref to store the algorithm controller for pause/resume
  const algorithmController = useRef(null);

  // Load algorithm data
  useEffect(() => {
    const loadAlgorithm = async () => {
      try {
        setError(null);
        let algoModule;
        
        if (selectedCategory === 'searching') {
          switch(selectedAlgorithm) {
            case 'linear-search':
              algoModule = await import('./algorithms/searching/LinearSearch');
              break;
            case 'binary-search':
              algoModule = await import('./algorithms/searching/BinarySearch');
              break;
            default:
              algoModule = await import('./algorithms/searching/LinearSearch');
          }
        } 
        else if (selectedCategory === 'sorting') {
          switch(selectedAlgorithm) {
            case 'bubble-sort':
              algoModule = await import('./algorithms/sorting/BubbleSort');
              break;
            case 'selection-sort':
              algoModule = await import('./algorithms/sorting/SelectionSort');
              break;
            case 'insertion-sort':
              algoModule = await import('./algorithms/sorting/InsertionSort');
              break;
            case 'merge-sort':
              algoModule = await import('./algorithms/sorting/MergeSort');
              break;
            case 'quick-sort':
              algoModule = await import('./algorithms/sorting/QuickSort');
              break;
            // Heap sort removed
            default:
              algoModule = await import('./algorithms/sorting/BubbleSort');
          }
        }
        else if (selectedCategory === 'graph') {
          switch(selectedAlgorithm) {
            case 'bfs':
              algoModule = await import('./algorithms/graph/BFS');
              break;
            case 'dfs':
              algoModule = await import('./algorithms/graph/DFS');
              break;
            case 'dijkstra':
              algoModule = await import('./algorithms/graph/Dijkstra');
              break;
            case 'bellman-ford':
              algoModule = await import('./algorithms/graph/BellmanFord');
              break;
            // Prim and Kruskal removed here
            case 'topological':
              algoModule = await import('./algorithms/graph/TopologicalSort');
              break;
            case 'cycle':
              algoModule = await import('./algorithms/graph/CycleDetection');
              break;
            default:
              algoModule = await import('./algorithms/graph/BFS');
          }
        }
        else if (selectedCategory === 'tree') {
          switch(selectedAlgorithm) {
            // BST insert, delete and AVL insert removed
            case 'bst-search':
              algoModule = await import('./algorithms/trees/bstOperations').then(m => m.bstSearch);
              break;
            case 'inorder-traversal':
              algoModule = await import('./algorithms/trees/traversals').then(m => m.inOrderTraversal);
              break;
            case 'preorder-traversal':
              algoModule = await import('./algorithms/trees/traversals').then(m => m.preOrderTraversal);
              break;
            case 'postorder-traversal':
              algoModule = await import('./algorithms/trees/traversals').then(m => m.postOrderTraversal);
              break;
            default:
              algoModule = await import('./algorithms/trees/traversals').then(m => m.inOrderTraversal);
          }
        }
        else if (selectedCategory === 'dp') {
          switch(selectedAlgorithm) {
            case 'fibonacci':
              algoModule = await import('./algorithms/dp/Fibonacci');
              break;
            case 'lcs':
              algoModule = await import('./algorithms/dp/LCS');
              break;
            case 'knapsack':
              algoModule = await import('./algorithms/dp/Knapsack');
              break;
            case 'lis':
              algoModule = await import('./algorithms/dp/LIS');
              break;
            case 'mcm':
              algoModule = await import('./algorithms/dp/MatrixChainMultiplication');
              break;
            default:
              algoModule = await import('./algorithms/dp/Fibonacci');
          }
        }
        else if (selectedCategory === 'backtracking') {
          switch(selectedAlgorithm) {
            case 'nqueens':
              algoModule = await import('./algorithms/backtracking/NQueens');
              break;
            // case 'sudoku':
            //    algoModule = await import('./algorithms/backtracking/SudokuSolver');
            //    break;
            case 'ratmaze':
              algoModule = await import('./algorithms/backtracking/RatInMaze');
              break;
            case 'subsetsum':
              algoModule = await import('./algorithms/backtracking/SubsetSum');
              break;
            default:
              algoModule = await import('./algorithms/backtracking/NQueens');
          }
        }
        
        if (algoModule?.default) {
          setAlgorithmData(algoModule.default);
        } else if (typeof algoModule === 'object') {
          setAlgorithmData(algoModule);
        } else {
          throw new Error(`Failed to load algorithm: ${selectedAlgorithm}`);
        }
      } catch (err) {
        console.error('Error loading algorithm:', err);
        setError(`Failed to load ${selectedAlgorithm} algorithm`);
        setAlgorithmData(null);
      }
    };
    
    loadAlgorithm();
  }, [selectedCategory, selectedAlgorithm]);

  const generateRandomInputHandler = () => {
    try {
      setError(null);
      
      if (selectedCategory === 'dp' && selectedAlgorithm === 'fibonacci') {
        // Special case for Fibonacci sequence
        setFibN(Math.floor(Math.random() * 16) + 5); // Random n between 5-20
        stopAlgorithm();
        return;
      }
      
      const result = generateRandomInput(selectedCategory, selectedAlgorithm);
      
      if (selectedCategory === 'graph') {
        setGraph(result.newGraph);
        if (result.sourceNode !== null && result.sourceNode !== undefined) {
          setSourceNode(result.sourceNode);
        }
        if (result.destinationNode !== null && result.destinationNode !== undefined) {
          setDestinationNode(result.destinationNode);
        }
      } else if (selectedCategory === 'tree') {
        setTreeValues(result.newArray);
        setTarget(result.newTarget);
        setTreeRoot(null); // Reset tree root
      } else {
        setArray(result.newArray);
        if (result.newTarget !== undefined) setTarget(result.newTarget);
      }
      
      stopAlgorithm();
    } catch (err) {
      console.error('Error generating random input:', err);
      setError('Failed to generate random input');
    }
  };

  const runAlgorithm = () => {
    if (!algorithmData || isRunning) return;
    
    try {
      setIsRunning(true);
      setIsPaused(false);
      setVisualizationState(null);
      setError(null);
      
      if (selectedCategory === 'graph') {
        // Some algorithms don't need a source node
        // Removed 'kruskal' and 'prim' from this list
        const startNode = ['topological', 'cycle'].includes(selectedAlgorithm) ? 0 : sourceNode;
        
        // Dijkstra and Bellman-Ford need both source and destination
        if (selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'bellman-ford') {
          algorithmController.current = algorithmData.visualize(
            graph,
            startNode,
            destinationNode,
            speed,
            (newState) => {
              setVisualizationState(newState);
            },
            () => {
              setIsRunning(false);
              setIsPaused(false);
            }
          );
        } else {
          algorithmController.current = algorithmData.visualize(
            graph, 
            startNode,
            speed, 
            (newState) => {
              setVisualizationState(newState);
            },
            () => {
              setIsRunning(false);
              setIsPaused(false);
            }
          );
        }
      } else if (selectedCategory === 'tree') {
        // Build tree from values if not already built
        let currentRoot = treeRoot;
        if (!currentRoot) {
          currentRoot = buildTree(treeValues);
        }
        
        algorithmController.current = algorithmData.visualize(
          currentRoot,
          target,
          speed, 
          (newState) => {
            setVisualizationState(newState);
          },
          () => {
            setIsRunning(false);
            setIsPaused(false);
          }
        );
      } else if (selectedCategory === 'dp' && selectedAlgorithm === 'fibonacci') {
        // Special case for Fibonacci sequence
        algorithmController.current = algorithmData.visualize(
          fibN,
          null, // No target needed for Fibonacci
          speed,
          (newState) => {
            setVisualizationState(newState);
          },
          () => {
            setIsRunning(false);
            setIsPaused(false);
          }
        );
      } else {
        // Handle other algorithms (array-based)
        algorithmController.current = algorithmData.visualize(
          array, 
          target,
          speed, 
          (newState) => {
            setVisualizationState(newState);
            // Update array if algorithm provides it
            if (newState?.array) {
              setArray(newState.array);
            }
          },
          () => {
            setIsRunning(false);
            setIsPaused(false);
          }
        );
      }
    } catch (err) {
      console.error('Error running algorithm:', err);
      setError(`Failed to run ${selectedAlgorithm} algorithm`);
      setIsRunning(false);
      setIsPaused(false);
    }
  };

  const pauseAlgorithm = () => {
    if (!isRunning || isPaused) return;
    
    try {
      if (algorithmController.current && algorithmController.current.pause) {
        algorithmController.current.pause();
        setIsPaused(true);
      }
    } catch (err) {
      console.error('Error pausing algorithm:', err);
      setError('Failed to pause algorithm');
    }
  };

  const resumeAlgorithm = () => {
    if (!isRunning || !isPaused) return;
    
    try {
      if (algorithmController.current && algorithmController.current.resume) {
        algorithmController.current.resume();
        setIsPaused(false);
      }
    } catch (err) {
      console.error('Error resuming algorithm:', err);
      setError('Failed to resume algorithm');
    }
  };

  const stopAlgorithm = () => {
    try {
      if (algorithmController.current && algorithmController.current.stop) {
        algorithmController.current.stop();
      }
      
      setIsRunning(false);
      setIsPaused(false);
      setVisualizationState(null);
      
      // Reset the input data if needed
      if (selectedCategory === 'tree' && treeRoot) {
        setTreeRoot(null);
      }
    } catch (err) {
      console.error('Error stopping algorithm:', err);
      setError('Failed to stop algorithm');
    }
  };

  // Helper to build tree from values
  const buildTree = (values) => {
    let root = null;
    for (const value of values) {
      root = insertBST(root, value);
    }
    return root;
  };

  // Simple BST insert for tree building
  const insertBST = (root, value) => {
    if (!root) return { value, left: null, right: null };
    if (value < root.value) {
      root.left = insertBST(root.left, value);
    } else {
      root.right = insertBST(root.right, value);
    }
    return root;
  };

  const handleCategoryChange = (newCategory) => {
    stopAlgorithm();
    setSelectedCategory(newCategory);
    // Set default algorithm for the new category
    let defaultAlgorithm;
    if (newCategory === 'tree') {
      defaultAlgorithm = 'bst-search'; // Default to BST search for tree category
    } else {
      defaultAlgorithm = algorithmCategories[newCategory]?.algorithms[0]?.id;
    }
    if (defaultAlgorithm) {
      setSelectedAlgorithm(defaultAlgorithm);
    }
  };

  const handleAlgorithmChange = (newAlgorithm) => {
    stopAlgorithm();
    setSelectedAlgorithm(newAlgorithm);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-3 text-center">
          <span className="font-semibold">Error:</span> {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-3">
          <LeftPanel 
            categories={algorithmCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            selectedAlgorithm={selectedAlgorithm}
            setSelectedAlgorithm={handleAlgorithmChange}
            array={array}
            setArray={setArray}
            target={target}
            setTarget={setTarget}
            graph={graph}
            setGraph={setGraph}
            sourceNode={sourceNode}
            setSourceNode={setSourceNode}
            destinationNode={destinationNode}
            setDestinationNode={setDestinationNode}
            treeValues={treeValues}
            setTreeValues={setTreeValues}
            fibN={fibN}
            setFibN={setFibN}
            generateRandomInput={generateRandomInputHandler}
            isRunning={isRunning}
          />
        </div>
        
        <div className="col-span-6">
          <AlgorithmVisualizer 
            algorithm={selectedAlgorithm}
            category={selectedCategory}
            array={array}
            graph={graph}
            target={target}
            state={visualizationState}
            error={error}
            inputValue={selectedAlgorithm === 'fibonacci' ? fibN : null}
          />
        </div>
        
        <div className="col-span-3">
          <RightPanel 
            algorithmData={algorithmData}
          />
        </div>
      </div>
      
      <BottomPanel 
        isRunning={isRunning}
        isPaused={isPaused}
        runAlgorithm={runAlgorithm}
        pauseAlgorithm={pauseAlgorithm}
        resumeAlgorithm={resumeAlgorithm}
        stopAlgorithm={stopAlgorithm}
        speed={speed}
        setSpeed={setSpeed}
        status={visualizationState?.status || 'Ready to visualize'}
      />
    </div>
  );
};

export default App;
