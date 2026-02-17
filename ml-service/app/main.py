from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.run_live_forecast import get_live_measurements

from app.predict import (
    predict_next_hour,
    predict_with_explanation,
    simulate_traffic,
    simulate_tree_plantation,
    simulate_combined,
    sensitivity_tree_analysis,
)

# ------------------------------------------------
# APP SETUP
# ------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------
# MODELS
# ------------------------------------------------
class AQIInput(BaseModel):
    PM2_5: float
    PM10: float
    NO2: float
    CO: float
    SO2: float
    O3: float
    lag_1: float
    lag_24: float
    rolling_mean_24: float


class TrafficSimulationInput(AQIInput):
    traffic_multiplier: float


class TreeSimulationInput(AQIInput):
    reduction_multiplier: float


class CombinedSimulationInput(AQIInput):
    traffic_multiplier: float
    reduction_multiplier: float


class SensitivityInput(AQIInput):
    min_multiplier: float
    max_multiplier: float
    steps: int


# ------------------------------------------------
# HELPER (single conversion function)
# ------------------------------------------------
def to_model_input(data):
    return {
        "PM2.5": data.PM2_5,
        "PM10": data.PM10,
        "NO2": data.NO2,
        "CO": data.CO,
        "SO2": data.SO2,
        "O3": data.O3,
        "lag_1": data.lag_1,
        "lag_24": data.lag_24,
        "rolling_mean_24": data.rolling_mean_24,
    }


# ------------------------------------------------
# ROUTES
# ------------------------------------------------

@app.post("/forecast")
def forecast(data: AQIInput):
    prediction = predict_next_hour(to_model_input(data))
    return {"predicted_next_hour_aqi": prediction}


@app.get("/live-aqi")
def live_aqi():
    features = get_live_measurements()

    pm25 = features.get("PM2.5", 0)
    current_aqi = int(pm25 * 2)  # quick approximation

    return {
        "current_aqi": current_aqi,
        "live_features": features
    }


@app.post("/forecast-with-explanation")
def forecast_explain(data: AQIInput):
    return predict_with_explanation(to_model_input(data))


@app.post("/simulate-traffic")
def traffic_simulation(data: TrafficSimulationInput):
    return simulate_traffic(
        to_model_input(data),
        data.traffic_multiplier
    )


@app.post("/simulate-tree-plantation")
def tree_simulation(data: TreeSimulationInput):
    return simulate_tree_plantation(
        to_model_input(data),
        data.reduction_multiplier
    )


@app.post("/simulate-combined")
def combined_simulation(data: CombinedSimulationInput):
    return simulate_combined(
        to_model_input(data),
        data.traffic_multiplier,
        data.reduction_multiplier
    )


@app.post("/sensitivity-tree")
def tree_sensitivity(data: SensitivityInput):
    return sensitivity_tree_analysis(
        to_model_input(data),
        data.min_multiplier,
        data.max_multiplier,
        data.steps
    )
