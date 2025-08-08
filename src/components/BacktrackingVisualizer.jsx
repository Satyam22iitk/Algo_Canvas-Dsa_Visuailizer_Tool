import React from 'react';

const BacktrackingVisualizer = ({ state }) => {
  const { 
    board, 
    maze, 
    solution, 
    nums, 
    path, 
    currentSum, 
    target, 
    status, 
    current 
  } = state || {};

  // Render N-Queens board
  const renderChessBoard = () => {
    if (!board) return null;
    
    return (
      <div className="mb-4">
        <h3 className="font-bold mb-2">Chess Board:</h3>
        <div className="inline-block border-2 border-gray-700">
          {board.map((row, i) => (
            <div key={i} className="flex">
              {row.map((cell, j) => {
                const isQueen = cell === 'Q';
                const isCurrent = current && current[0] === i && current[1] === j;
                
                return (
                  <div
                    key={`${i}-${j}`}
                    className={`
                      w-10 h-10 flex items-center justify-center
                      ${(i + j) % 2 === 0 ? 'bg-gray-000' : 'bg-gray-700'}
                      ${isCurrent ? 'ring-2 ring-yellow-400' : ''}
                    `}
                  >
                    {isQueen ? (
                      <span className="text-red-400 font-bold text-lg">♕</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Sudoku board
  const renderSudokuBoard = () => {
    if (!board) return null;
    
    return (
      <div className="mb-4">
        <h3 className="font-bold mb-2">Sudoku Board:</h3>
        <div className="inline-grid grid-cols-9 border-2 border-gray-700">
          {board.flat().map((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const isCurrent = current && current[0] === row && current[1] === col;
            const boxTop = row % 3 === 0;
            const boxLeft = col % 3 === 0;
            
            return (
              <div
                key={index}
                className={`
                  w-8 h-8 flex items-center justify-center border
                  ${boxTop ? 'border-t-2 border-gray-500' : 'border-gray-700'}
                  ${boxLeft ? 'border-l-2 border-gray-500' : 'border-gray-700'}
                  ${row === 8 ? 'border-b-2 border-gray-500' : ''}
                  ${col === 8 ? 'border-r-2 border-gray-500' : ''}
                  ${isCurrent ? 'bg-yellow-600' : cell === '.' ? 'bg-gray-900' : 'bg-gray-800'}
                `}
              >
                {cell === '.' ? '' : cell}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Maze
  const renderMaze = () => {
    if (!maze) return null;
    
    return (
      <div className="mb-4">
        <h3 className="font-bold mb-2">Maze:</h3>
        <div className="inline-block border-2 border-gray-700">
          {maze.map((row, i) => (
            <div key={i} className="flex">
              {row.map((cell, j) => {
                const isPath = solution && solution[i][j] === 1;
                const isCurrent = current && current[0] === i && current[1] === j;
                const isStart = i === 0 && j === 0;
                const isEnd = i === maze.length - 1 && j === maze[0].length - 1;
                
                return (
                  <div
  key={`${i}-${j}`}
  className={`
    w-8 h-8 flex items-center justify-center font-bold text-white border border-gray-600
    ${isStart ? 'bg-green-600 text-black' : isEnd ? 'bg-red-600 text-white' : ''}
    ${isPath ? 'bg-yellow-400 text-black' : cell === 1 ? 'bg-white text-black' : 'bg-brown-800'}
    ${isCurrent ? 'ring-2 ring-yellow-400' : ''}
  `}
>
  {isStart ? 'S' : isEnd ? 'E' : ''}
</div>

                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Subset Sum
  const renderSubsetSum = () => {
    if (!nums) return null;
    
    return (
      <div className="mb-4">
        <h3 className="font-bold mb-2">Numbers:</h3>
        <div className="flex flex-wrap mb-2">
          {nums.map((num, i) => (
            <div
              key={i}
              className={`
                m-1 p-2 border rounded
                ${path.includes(num) ? 'bg-blue-700 border-blue-400' : 'bg-gray-800 border-gray-700'}
              `}
            >
              {num}
            </div>
          ))}
        </div>
        
        <div className="mt-2">
          <p>Current Path: [{path.join(', ')}]</p>
          <p>Current Sum: {currentSum}</p>
          <p>Target: {target}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-blue-400">
        {status || 'Backtracking Visualization'}
      </h2>
      
      {board && board[0]?.length === board.length && renderChessBoard()}
      {board && board.length === 9 && renderSudokuBoard()}
      {maze && renderMaze()}
      {nums && renderSubsetSum()}
    </div>
  );
};

export default BacktrackingVisualizer;