import joblib
import pandas as pd
import os
import shap

# Load model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "app", "models", "aqi_model.pkl")

model = joblib.load(MODEL_PATH)

# Create SHAP explainer once
explainer = shap.TreeExplainer(model)


# -------------------------------
# Utility: Safe DataFrame Builder
# -------------------------------
def prepare_dataframe(input_data: dict):
    df = pd.DataFrame([input_data])

    # Ensure all required features exist
    for feature in model.feature_names_in_:
        if feature not in df.columns:
            df[feature] = 0  # default safe value

    # Keep correct order
    df = df[model.feature_names_in_]

    return df


# -------------------------------
# Basic Prediction
# -------------------------------
def predict_next_hour(input_data: dict):
    df = prepare_dataframe(input_data)
    prediction = model.predict(df)[0]
    return float(prediction)


# -------------------------------
# Prediction + SHAP Explanation
# -------------------------------
def predict_with_explanation(input_data: dict):
    df = prepare_dataframe(input_data)

    prediction = model.predict(df)[0]

    shap_values = explainer(df)
    base_value = shap_values.base_values[0]

    feature_contributions = dict(
        zip(df.columns, shap_values.values[0])
    )

    feature_contributions = {
        k: float(v) for k, v in feature_contributions.items()
    }

    return {
        "prediction": float(prediction),
        "base_value": float(base_value),
        "feature_contributions": feature_contributions
    }


# -------------------------------
# Traffic Simulation
# -------------------------------
def simulate_traffic(input_data: dict, traffic_multiplier: float):
    df = prepare_dataframe(input_data)

    base_prediction = model.predict(df)[0]
    modified_df = df.copy()

    if "NO2" in modified_df.columns:
        modified_df["NO2"] *= traffic_multiplier

    if "CO" in modified_df.columns:
        modified_df["CO"] *= traffic_multiplier

    simulated_prediction = model.predict(modified_df)[0]

    return {
        "base_prediction": float(base_prediction),
        "simulated_prediction": float(simulated_prediction),
        "impact_difference": float(simulated_prediction - base_prediction)
    }


# -------------------------------
# Tree Plantation Simulation
# -------------------------------
def simulate_tree_plantation(input_data: dict, reduction_multiplier: float):
    df = prepare_dataframe(input_data)

    base_prediction = model.predict(df)[0]
    modified_df = df.copy()

    if "PM2.5" in modified_df.columns:
        modified_df["PM2.5"] *= reduction_multiplier

    if "PM10" in modified_df.columns:
        modified_df["PM10"] *= reduction_multiplier

    simulated_prediction = model.predict(modified_df)[0]

    return {
        "base_prediction": float(base_prediction),
        "simulated_prediction": float(simulated_prediction),
        "impact_difference": float(simulated_prediction - base_prediction)
    }


# -------------------------------
# Combined Simulation
# -------------------------------
def simulate_combined(input_data: dict,
                      traffic_multiplier: float,
                      reduction_multiplier: float):

    df = prepare_dataframe(input_data)

    base_prediction = model.predict(df)[0]
    modified_df = df.copy()

    # Traffic impact
    if "NO2" in modified_df.columns:
        modified_df["NO2"] *= traffic_multiplier

    if "CO" in modified_df.columns:
        modified_df["CO"] *= traffic_multiplier

    # Tree impact
    if "PM2.5" in modified_df.columns:
        modified_df["PM2.5"] *= reduction_multiplier

    if "PM10" in modified_df.columns:
        modified_df["PM10"] *= reduction_multiplier

    simulated_prediction = model.predict(modified_df)[0]

    return {
        "base_prediction": float(base_prediction),
        "simulated_prediction": float(simulated_prediction),
        "impact_difference": float(simulated_prediction - base_prediction)
    }


# -------------------------------
# Sensitivity Analysis
# -------------------------------
def sensitivity_tree_analysis(input_data: dict,
                               min_multiplier: float,
                               max_multiplier: float,
                               steps: int):

    df = prepare_dataframe(input_data)

    base_prediction = model.predict(df)[0]

    multipliers = [
        min_multiplier + i * (max_multiplier - min_multiplier) / (steps - 1)
        for i in range(steps)
    ]

    results = []

    for m in multipliers:
        modified_df = df.copy()

        if "PM2.5" in modified_df.columns:
            modified_df["PM2.5"] *= m

        if "PM10" in modified_df.columns:
            modified_df["PM10"] *= m

        prediction = model.predict(modified_df)[0]

        results.append({
            "multiplier": float(m),
            "predicted_aqi": float(prediction),
            "impact_difference": float(prediction - base_prediction)
        })

    return {
        "base_prediction": float(base_prediction),
        "analysis": results
    }
