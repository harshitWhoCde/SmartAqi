from test_openaq import get_live_measurements
from live_lag import get_lag_features, save_prediction
from predict import predict_next_hour


def run_pipeline():

    print("\n🔵 STEP 1: Fetch Live Data")
    features = get_live_measurements()

    print("Features:", features)

    # ---------------------------
    # STEP 2 — Add lag features
    # ---------------------------
    print("\n🧠 STEP 2: Getting lag features...")

    lag_1, lag_24, rolling = get_lag_features()

    features["lag_1"] = lag_1
    features["lag_24"] = lag_24
    features["rolling_mean_24"] = rolling

    print("With lags:", features)

    # ---------------------------
    # STEP 3 — Predict AQI
    # ---------------------------
    print("\n⚡ STEP 3: Predicting...")

    prediction = predict_next_hour(features)

    print("Predicted AQI:", prediction)

    # ---------------------------
    # STEP 4 — Save for future
    # ---------------------------
    print("\n💾 STEP 4: Saving prediction")

    save_prediction(prediction)


if __name__ == "__main__":
    run_pipeline()
