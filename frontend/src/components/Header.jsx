import { TrendingUp, TrendingDown } from "lucide-react";

export function Header({
  selectedCity,
  onCityChange,
  currentAQI,
  currentLiveAQI,   // ⭐ NEW
  aqiCategory,
  trend,
  aqiChange,
}) {

  const cities = ["Delhi", "Mumbai", "Bangalore"];

  /* -------------------------------
     AQI Styling
  -------------------------------- */
  const getSeverityStyle = (aqi = 0) => {
    if (aqi <= 100) {
      return {
        background: "bg-gradient-to-br from-green-50 to-emerald-50",
        border: "border-green-200",
        borderLeft: "border-l-4 border-l-green-500",
        textAccent: "text-green-600",
        iconColor: "text-green-500",
      };
    } else if (aqi <= 300) {
      return {
        background: "bg-gradient-to-br from-orange-50 to-amber-50",
        border: "border-orange-200",
        borderLeft: "border-l-4 border-l-orange-500",
        textAccent: "text-orange-600",
        iconColor: "text-orange-500",
      };
    } else {
      return {
        background: "bg-gradient-to-br from-red-50 to-rose-50",
        border: "border-red-200",
        borderLeft: "border-l-4 border-l-red-500",
        textAccent: "text-red-600",
        iconColor: "text-red-500",
      };
    }
  };

  const severityStyle = getSeverityStyle(currentAQI);

  const liveDifference =
    currentLiveAQI !== null
      ? currentAQI - currentLiveAQI
      : null;

  return (
    <div className="space-y-6">

      {/* Title */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Urban Pollution Intelligence
        </h1>
        <p className="text-lg text-gray-600">
          24-Hour AQI Forecast & Policy Simulation
        </p>
      </div>

      {/* City + Card */}
      <div className="flex items-start gap-6 flex-wrap">

        {/* City Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select City
          </label>

          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* AQI CARD */}
        <div
          className={`${severityStyle.background} ${severityStyle.border} ${severityStyle.borderLeft} rounded-2xl p-8 shadow-xl min-w-[360px]`}
        >
          <p className="text-sm font-semibold text-gray-600 mb-3 uppercase">
            Predicted AQI (24h)
          </p>

          {/* MAIN NUMBER */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-bold text-gray-900">
                  {currentAQI ? Math.round(currentAQI) : "--"}
                </span>

                <span className={`text-xl font-semibold ${severityStyle.textAccent}`}>
                  {aqiCategory}
                </span>
              </div>
            </div>

            {trend === "up" ? (
              <TrendingUp className={`w-7 h-7 ${severityStyle.iconColor}`} />
            ) : (
              <TrendingDown className={`w-7 h-7 ${severityStyle.iconColor}`} />
            )}
          </div>

          {/* ⭐ LIVE AQI SECTION */}
          {currentLiveAQI !== null && (
            <div className="pt-3 border-t border-gray-200 mb-3">
              <p className="text-sm text-gray-600">
                Current AQI:{" "}
                <span className="font-semibold text-gray-900">
                  {Math.round(currentLiveAQI)}
                </span>
              </p>

              {liveDifference !== null && (
                <p
                  className={`text-sm font-semibold mt-1 ${
                    liveDifference > 0
                      ? "text-red-600"
                      : liveDifference < 0
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {liveDifference > 0 ? "+" : ""}
                  {Math.round(liveDifference)} vs current
                </p>
              )}
            </div>
          )}

          {/* Simulation Impact */}
          {aqiChange !== null && aqiChange !== undefined && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                {aqiChange > 0 ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-red-500" />
                    <span className="text-base font-semibold text-red-600">
                      +{Math.abs(aqiChange).toFixed(0)} from base
                    </span>
                  </>
                ) : aqiChange < 0 ? (
                  <>
                    <TrendingDown className="w-5 h-5 text-green-500" />
                    <span className="text-base font-semibold text-green-600">
                      −{Math.abs(aqiChange).toFixed(0)} from base
                    </span>
                  </>
                ) : (
                  <span className="text-base text-gray-500">
                    No change from base
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-1 ml-7">
                {aqiChange < 0
                  ? "Improvement"
                  : aqiChange > 0
                  ? "Deterioration"
                  : "Stable"}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
