import { useState } from "react";

export function ControlPanel({ onSimulate, aqiChange, loading }) {
  const [trafficMultiplier, setTrafficMultiplier] = useState(1.0);
  const [treeMultiplier, setTreeMultiplier] = useState(1.0);

  const handleSimulate = () => {
    onSimulate(trafficMultiplier, treeMultiplier);
  };

  const handleTrafficInput = (value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0.5 && num <= 2.0) {
      setTrafficMultiplier(num);
    }
  };

  const handleTreeInput = (value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0.5 && num <= 1.2) {
      setTreeMultiplier(num);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 h-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Policy Controls
      </h2>

      <div className="space-y-8">

        {/* Traffic */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              Traffic Multiplier
            </label>
            <input
              type="number"
              min="0.5"
              max="2.0"
              step="0.1"
              value={trafficMultiplier.toFixed(1)}
              onChange={(e) => handleTrafficInput(e.target.value)}
              className="w-16 px-2 py-1 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-md text-center"
            />
          </div>

          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={trafficMultiplier}
            onChange={(e) => setTrafficMultiplier(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-600"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1 mb-2">
            <span>0.5x</span>
            <span>2.0x</span>
          </div>

          <p className="text-xs text-gray-500">
            Simulates increased or decreased vehicular emissions
          </p>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Tree */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              Tree Plantation (PM Reduction)
            </label>
            <input
              type="number"
              min="0.5"
              max="1.2"
              step="0.1"
              value={treeMultiplier.toFixed(1)}
              onChange={(e) => handleTreeInput(e.target.value)}
              className="w-16 px-2 py-1 text-sm font-semibold text-teal-600 bg-teal-50 border border-teal-200 rounded-md text-center"
            />
          </div>

          <input
            type="range"
            min="0.5"
            max="1.2"
            step="0.1"
            value={treeMultiplier}
            onChange={(e) => setTreeMultiplier(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-teal-600"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1 mb-2">
            <span>0.5</span>
            <span>1.2</span>
          </div>

          <p className="text-xs text-gray-500">
            Reduces PM2.5 and PM10 concentration impact
          </p>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Button */}
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Running Simulation..." : "Run Simulation"}
        </button>

        {/* Impact */}
        {aqiChange !== null && (
          <div
            className={`p-4 rounded-xl border ${
              aqiChange < 0
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p className="text-sm font-semibold mb-1">Predicted Impact</p>

            <p
              className={`text-2xl font-bold ${
                aqiChange < 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {aqiChange > 0 ? "+" : ""}
              {aqiChange.toFixed(1)} AQI
            </p>

            <p className="text-xs text-gray-600 mt-1">
              {aqiChange < 0
                ? "Air quality improvement"
                : "Air quality worsening"}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
