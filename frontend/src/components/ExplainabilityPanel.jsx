import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  LabelList,
} from "recharts";
import { Info } from "lucide-react";
import { useState, useMemo } from "react";

export function ExplainabilityPanel({ features = [] }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // ⭐ Sort by absolute importance (PRO DASHBOARD BEHAVIOR)
  const sortedFeatures = useMemo(() => {
    return [...features].sort(
      (a, b) => Math.abs(b.value) - Math.abs(a.value)
    );
  }, [features]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;

      return (
        <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700">
            {payload[0].payload.name}
          </p>

          <p
            className={`text-sm font-semibold ${
              value > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {value > 0 ? "+" : ""}
            {value.toFixed(2)}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {value > 0 ? "Increases AQI" : "Decreases AQI"}
          </p>
        </div>
      );
    }
    return null;
  };

  // Safety when data not loaded yet
  if (!features.length) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading SHAP explanation...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 h-full">

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-semibold text-gray-900">
            Feature Impact
          </h2>

          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Info className="w-4 h-4" />
            </button>

            {showTooltip && (
              <div className="absolute left-6 top-0 z-10 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl">
                SHAP values explain how much each feature pushed the AQI up or down.
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Feature Contribution to Predicted AQI
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={sortedFeatures}
          layout="vertical"
          margin={{ top: 5, right: 60, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 11 }} />

          <YAxis
            type="category"
            dataKey="name"
            stroke="#6b7280"
            tick={{ fontSize: 11 }}
            width={80}
          />

          <Tooltip content={<CustomTooltip />} />

          <ReferenceLine x={0} stroke="#9ca3af" strokeWidth={2} />

          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {sortedFeatures.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.value > 0 ? "#ef4444" : "#10b981"}
                opacity={0.85}
              />
            ))}

            <LabelList
              dataKey="value"
              position="right"
              formatter={(v) =>
                v > 0 ? `+${v.toFixed(0)}` : v.toFixed(0)
              }
              style={{
                fontSize: 11,
                fontWeight: 600,
                fill: "#374151",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded opacity-85"></div>
          <span className="text-xs text-gray-600">
            Positive (increases AQI)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded opacity-85"></div>
          <span className="text-xs text-gray-600">
            Negative (decreases AQI)
          </span>
        </div>
      </div>

    </div>
  );
}
