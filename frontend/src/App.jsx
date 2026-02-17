import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ControlPanel } from "./components/ControlPanel";
import { SensitivityChart } from "./components/SensitivityChart";
import { ExplainabilityPanel } from "./components/ExplainabilityPanel";
import {
  forecastWithExplanation,
  simulateCombined,
  sensitivityTree,
} from "./api";

// Default input (you can later make this dynamic)
const defaultInput = {
  PM2_5: 446.61,
  PM10: 607.71,
  NO2: 57.28,
  CO: 2.53,
  SO2: 13.86,
  O3: 29.31,
  lag_1: 548,
  lag_24: 443,
  rolling_mean_24: 483.45,
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState("Delhi");

  const [currentAQI, setCurrentAQI] = useState(0);
  const [aqiCategory, setAqiCategory] = useState("Moderate");
  const [trend, setTrend] = useState("up");

  const [aqiChange, setAqiChange] = useState(null);
  const [features, setFeatures] = useState([]);
  const [sensitivityData, setSensitivityData] = useState([]);

  const [loading, setLoading] = useState(false);

  // AQI category helper
  const getAQICategory = (aqi) => {
    if (aqi <= 100) return "Moderate";
    if (aqi <= 200) return "Poor";
    if (aqi <= 300) return "Very Poor";
    return "Severe";
  };

  // Load initial forecast + SHAP
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await forecastWithExplanation(defaultInput);

        const prediction = res.data.prediction;

        setCurrentAQI(prediction);
        setAqiCategory(getAQICategory(prediction));

        // Convert SHAP object → array
        const shapFeatures = Object.entries(
          res.data.feature_contributions
        ).map(([name, value]) => ({
          name,
          value,
        }));

        setFeatures(shapFeatures);

        // Load sensitivity curve
        const sensRes = await sensitivityTree({
          ...defaultInput,
          min_multiplier: 0.5,
          max_multiplier: 1.2,
          steps: 10,
        });

        setSensitivityData(sensRes.data.analysis);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    loadInitialData();
  }, []);

  console.log("Sensitivity Data:", sensitivityData);


  // Simulation from control panel
  const handleSimulate = async (trafficMultiplier, treeMultiplier) => {
    try {
      setLoading(true);

      const simRes = await simulateCombined({
        ...defaultInput,
        traffic_multiplier: trafficMultiplier,
        reduction_multiplier: treeMultiplier,
      });

      setCurrentAQI(simRes.data.simulated_prediction);
      setAqiChange(simRes.data.impact_difference);
      setAqiCategory(getAQICategory(simRes.data.simulated_prediction));

      setTrend(simRes.data.impact_difference > 0 ? "up" : "down");
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-8 py-10">

        <Header
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          currentAQI={Math.round(currentAQI)}
          aqiCategory={aqiCategory}
          trend={trend}
          aqiChange={aqiChange}
        />

        <div className="mt-10 grid grid-cols-12 gap-8">

          <div className="col-span-12 lg:col-span-3">
            <ControlPanel
              onSimulate={handleSimulate}
              aqiChange={aqiChange}
              loading={loading}
            />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <SensitivityChart
              baseAQI={currentAQI}
              data={sensitivityData}
            />
          </div>

          <div className="col-span-12 lg:col-span-3">
            <ExplainabilityPanel features={features} />
          </div>

        </div>
      </div>
    </div>
  );
}
