import React from 'react';

const RightPanel = ({ algorithmData }) => {
  if (!algorithmData) {
    return (
      <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800 h-full">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Select an algorithm to see details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800 h-full overflow-auto">
      <div>
        <h3 className="font-bold mb-2 text-blue-400">C++ Code</h3>
        <pre className="bg-gray-900 p-3 rounded text-green-400 text-sm overflow-auto">
          {algorithmData.code}
        </pre>
      </div>
      
      <div>
        <h3 className="font-bold mb-2 text-blue-400">Explanation</h3>
        <div className="bg-gray-900 p-3 rounded text-sm text-white">
          <p>{algorithmData.explanation}</p>
          
          {algorithmData.complexity && (
            <div className="mt-3 p-2 bg-gray-800 rounded">
              <p className="font-semibold">Complexity Analysis:</p>
              <p>Time: {algorithmData.complexity.time}</p>
              <p>Space: {algorithmData.complexity.space}</p>
            </div>
          )}
        </div>
      </div>
      
      {algorithmData.comparison && (
        <div className="text-sm bg-gray-900 p-3 rounded">
          <p className="font-semibold text-blue-400">Comparison:</p>
          <p>{algorithmData.comparison}</p>
        </div>
      )}
    </div>
  );
};

export default RightPanel;