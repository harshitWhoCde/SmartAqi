import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

export function SensitivityChart({ baseAQI, data = [] }) {

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {

      const pmMultiplier = payload[0].payload.multiplier;
      const predictedAQI = payload[0].payload.predicted_aqi;
      const impact = predictedAQI - baseAQI;

      return (
        <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Traffic Scenario
          </p>

          <p className="text-sm font-medium text-gray-700 mb-1">
            Traffic Multiplier:{" "}
            <span className="text-blue-600 font-semibold">
              {pmMultiplier.toFixed(2)}
            </span>
          </p>

          <p className="text-sm font-medium text-gray-700 mb-1">
            Predicted AQI:{" "}
            <span className="text-teal-600 font-semibold">
              {predictedAQI.toFixed(0)}
            </span>
          </p>

          <p
            className={`text-sm font-semibold mt-2 pt-2 border-t border-gray-200 ${
              impact > 0
                ? "text-red-500"
                : impact < 0
                ? "text-green-500"
                : "text-gray-500"
            }`}
          >
            Impact: {impact > 0 ? "+" : ""}
            {impact.toFixed(0)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 h-full flex items-center justify-center">
        <p className="text-gray-500 text-sm">
          Loading sensitivity analysis...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 h-full">

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Sensitivity Analysis
        </h2>
        <p className="text-sm text-gray-600">
          AQI Response to PM Multiplier Changes
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          {/* FIXED */}
          <XAxis
            dataKey="multiplier"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#6b7280"
            domain={["auto", "auto"]}
            tick={{ fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend />

          <ReferenceLine
            y={baseAQI}
            stroke="#6b7280"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: `Base AQI: ${Math.round(baseAQI)}`,
              position: "right",
              fill: "#6b7280",
              fontSize: 12,
            }}
          />

          {/* FIXED */}
          <Line
            type="monotone"
            dataKey="predicted_aqi"
            stroke="#0891b2"
            strokeWidth={3}
            dot={{ fill: "#0891b2", r: 4 }}
            activeDot={{ r: 6 }}
            name="Predicted AQI"
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
