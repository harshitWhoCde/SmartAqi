# app/run_live_forecast.py

from app.test_openaq import get_live_measurements
from app.live_lag import get_lag_features, save_prediction
from app.predict import predict_next_hour


# -----------------------------------
# MAIN PIPELINE
# -----------------------------------
def run_pipeline():

    print("\n🔵 STEP 1: Fetch Live Data")

    features = get_live_measurements()

    if not features:
        print("❌ No live measurements received")
        return None

    print("Features:", features)

    # -----------------------------------
    # STEP 2 — Add lag features
    # -----------------------------------
    print("\n🧠 STEP 2: Getting lag features...")

    lag_1, lag_24, rolling = get_lag_features()

    features["lag_1"] = lag_1
    features["lag_24"] = lag_24
    features["rolling_mean_24"] = rolling

    print("With lags:", features)

    # -----------------------------------
    # STEP 3 — Predict AQI
    # -----------------------------------
    print("\n⚡ STEP 3: Predicting...")

    prediction = predict_next_hour(features)

    print("Predicted AQI:", prediction)

    # -----------------------------------
    # STEP 4 — Save prediction
    # -----------------------------------
    print("\n💾 STEP 4: Saving prediction")

    save_prediction(prediction)

    print("✅ Saved prediction to history")

    return prediction


# -----------------------------------
# RUN SCRIPT
# -----------------------------------
if __name__ == "__main__":
    run_pipeline()
