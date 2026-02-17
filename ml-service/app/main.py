
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.predict import (
    predict_next_hour,
    predict_with_explanation,
    simulate_traffic,
    simulate_tree_plantation,
    sensitivity_tree_analysis
)

from app.predict import simulate_combined
from app.predict import sensitivity_tree_analysis







app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


@app.post("/forecast")
def forecast(data: AQIInput):

    input_dict = {
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

    prediction = predict_next_hour(input_dict)

    return {
        "predicted_next_hour_aqi": prediction
    }


@app.post("/forecast-with-explanation")
def forecast_explain(data: AQIInput):

    input_dict = {
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

    result = predict_with_explanation(input_dict)

    return result

class TrafficSimulationInput(AQIInput):
    traffic_multiplier: float

@app.post("/simulate-traffic")
def traffic_simulation(data: TrafficSimulationInput):

    input_dict = {
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

    result = simulate_traffic(input_dict, data.traffic_multiplier)

    return result

class TreeSimulationInput(AQIInput):
    reduction_multiplier: float

@app.post("/simulate-tree-plantation")
def tree_simulation(data: TreeSimulationInput):

    input_dict = {
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

    result = simulate_tree_plantation(
        input_dict,
        data.reduction_multiplier
    )

    return result

class CombinedSimulationInput(AQIInput):
    traffic_multiplier: float
    reduction_multiplier: float
@app.post("/simulate-combined")
def combined_simulation(data: CombinedSimulationInput):

    input_dict = {
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

    result = simulate_combined(
        input_dict,
        data.traffic_multiplier,
        data.reduction_multiplier
    )

    return result

class SensitivityInput(AQIInput):
    min_multiplier: float
    max_multiplier: float
    steps: int

@app.post("/sensitivity-tree")
def tree_sensitivity(data: SensitivityInput):

    input_dict = {
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

    result = sensitivity_tree_analysis(
        input_dict,
        data.min_multiplier,
        data.max_multiplier,
        data.steps
    )

    return result
