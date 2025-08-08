import React from 'react';

const DPVisualizer = ({ state }) => {
  const { dpTable, status, result, current, comparing, split, 
          weights, values, capacity, text1, text2, nums, dims, fibN } = state || {};

  const renderDPTable = () => {
    if (!dpTable) return null;

    // Handle object-style memoization table (Fibonacci)
    if (typeof dpTable === 'object' && !Array.isArray(dpTable)) {
      const keys = Object.keys(dpTable).map(Number).sort((a, b) => a - b);
      return (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Memoization Table:</h3>
          <div className="flex flex-wrap">
            {keys.map((key) => (
              <div 
                key={key} 
                className={`
                  p-2 m-1 border rounded min-w-[70px] text-center
                  ${current === key ? 'bg-yellow-600 border-yellow-400' : 'bg-gray-800 border-gray-700'}
                `}
              >
                <div className="text-xs">fib({key})</div>
                <div className="font-bold">{dpTable[key]}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Handle 1D DP table (like in LIS)
    if (Array.isArray(dpTable) && !Array.isArray(dpTable[0])) {
      return (
        <div className="mb-4">
          <h3 className="font-bold mb-2">DP Table:</h3>
          <div className="flex flex-wrap">
            {dpTable.map((val, idx) => (
              <div key={idx} className={`
                p-2 m-1 border rounded min-w-[40px] text-center
                ${current === idx ? 'bg-yellow-600 border-yellow-400' : 'bg-gray-800 border-gray-700'}
                ${comparing === idx ? 'bg-blue-800 border-blue-400' : ''}
              `}>
                {val}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Handle 2D DP table
    if (Array.isArray(dpTable) && Array.isArray(dpTable[0])) {
      return (
        <div className="mb-4 overflow-auto max-h-96">
          <h3 className="font-bold mb-2">DP Table:</h3>
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border p-1 bg-gray-800"></th>
                {dpTable[0].map((_, j) => (
                  <th key={j} className="border p-1 bg-gray-800">Col {j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dpTable.map((row, i) => (
                <tr key={i}>
                  <th className="border p-1 bg-gray-800">Row {i}</th>
                  {row.map((cell, j) => {
                    const isCurrent = current && current[0] === i && current[1] === j;
                    const isSplit = split === j;
                    return (
                      <td 
                        key={j} 
                        className={`
                          border p-2 text-center
                          ${isCurrent ? 'bg-yellow-600 border-yellow-400' : 'bg-gray-800 border-gray-700'}
                          ${isSplit ? 'bg-blue-800 border-blue-400' : ''}
                        `}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  };

  const renderAlgorithmSpecificInfo = () => {
    if (weights && values && capacity) {
      return (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Knapsack Problem:</h3>
          <p>Capacity: {capacity}</p>
          <div className="flex mt-2">
            <div className="mr-4">
              <p className="font-semibold">Weights:</p>
              <div className="flex">
                {weights.map((w, i) => (
                  <span key={i} className="mx-1 p-1 bg-gray-800 rounded">{w}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold">Values:</p>
              <div className="flex">
                {values.map((v, i) => (
                  <span key={i} className="mx-1 p-1 bg-gray-800 rounded">{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (text1 && text2) {
      return (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Strings:</h3>
          <p>String 1: {text1}</p>
          <p>String 2: {text2}</p>
        </div>
      );
    }
    
    if (nums) {
      return (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Sequence:</h3>
          <div className="flex flex-wrap">
            {nums.map((num, i) => (
              <span 
                key={i} 
                className={`
                  mx-1 p-2 border rounded
                  ${current === i ? 'bg-yellow-600 border-yellow-400' : 'bg-gray-800 border-gray-700'}
                  ${comparing === i ? 'bg-blue-800 border-blue-400' : ''}
                `}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      );
    }
    
    if (dims) {
      return (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Matrix Dimensions:</h3>
          <div className="flex flex-wrap">
            {dims.map((dim, i) => (
              <span key={i} className="mx-1 p-2 bg-gray-800 border border-gray-700 rounded">
                {dim}
              </span>
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="h-full overflow-auto p-4">
      {/* Show current n value prominently at the top for Fibonacci */}
      {/* {fibN !== undefined && (
        <div className="mb-4 p-3 bg-purple-900 rounded-lg text-center">
          <h3 className="font-bold text-lg">Calculating:</h3>
          <p className="text-xl">fib({fibN})</p>
        </div>
      )} */}
      
      <h2 className="text-xl font-bold mb-4 text-blue-400">
        {status }
      </h2>
      
      {renderAlgorithmSpecificInfo()}
      {renderDPTable()}
      
      {result !== undefined && (
        <div className="mt-4 p-3 bg-green-900 rounded">
          <h3 className="font-bold">Result:</h3>
          <p className="text-xl">{result}</p>
        </div>
      )}
    </div>
  );
};

export default DPVisualizer;