import React from 'react';

const BottomPanel = ({ 
  isRunning, 
  isPaused,
  runAlgorithm, 
  pauseAlgorithm,
  resumeAlgorithm,
  stopAlgorithm,
  speed, 
  setSpeed, 
  status 
}) => {
  return (
    <div className="p-3 border-t border-gray-700 bg-gray-800 flex justify-between items-center text-sm">
      <div className="flex items-center gap-4">
        {/* Run Button - shows when not running */}
        {!isRunning && !isPaused && (
          <button
            onClick={runAlgorithm}
            className="px-4 py-2 rounded font-medium bg-green-600 hover:bg-green-700"
          >
            Run Algorithm
          </button>
        )}
        
        {/* Pause Button - shows when running and not paused */}
        {isRunning && !isPaused && (
          <button
            onClick={pauseAlgorithm}
            className="px-4 py-2 rounded font-medium bg-yellow-600 hover:bg-yellow-700"
          >
            Pause
          </button>
        )}
        
        {/* Resume Button - shows when paused */}
        {isPaused && (
          <button
            onClick={resumeAlgorithm}
            className="px-4 py-2 rounded font-medium bg-blue-600 hover:bg-blue-700"
          >
            Resume
          </button>
        )}
        
        {/* stop Button - shows when running or paused */}
        {(isRunning || isPaused) && (
          <button
            onClick={stopAlgorithm}
            className="px-4 py-2 rounded font-medium bg-red-600 hover:bg-red-700"
          >
            stop
          </button>
        )}
        
        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-blue-400">Speed:</span>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-32 accent-blue-500"
            disabled={isRunning}
          />
          <span className="w-8 text-center">{speed}x</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
  © 2025 Satyam Srivastava, IIT Kanpur. All rights reserved.
</p>
      
      {/* Status Display */}
      <div className={`px-4 py-2 rounded ${
        status?.includes('Found') ? 'bg-green-900 text-green-300' : 
        status?.includes('Running') ? 'bg-yellow-900 text-yellow-300' : 
        status?.includes('Paused') ? 'bg-purple-900 text-purple-300' :
        status?.includes('Completed') ? 'bg-blue-900 text-blue-300' :
        'bg-gray-900 text-gray-300'
      }`}>
        {status || 'Ready to visualize'}
      </div>
    </div>
  );
};

export default BottomPanel;