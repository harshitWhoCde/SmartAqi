import pandas as pd
from datetime import datetime
import os

HISTORY_PATH = "data/live_history.csv"


# ==================================
# SAVE PREDICTION
# ==================================
def save_prediction(aqi_value):

    new_row = pd.DataFrame([{
        "timestamp": datetime.now(),
        "aqi": aqi_value
    }])

    if os.path.exists(HISTORY_PATH):
        try:
            df = pd.read_csv(HISTORY_PATH)
            df = pd.concat([df, new_row], ignore_index=True)
        except:
            df = new_row
    else:
        df = new_row

    df.to_csv(HISTORY_PATH, index=False)

    print("✅ Saved prediction to history")


# ==================================
# GET LAG FEATURES
# ==================================
def get_lag_features():

    # File doesn’t exist
    if not os.path.exists(HISTORY_PATH):
        return 100, 100, 100

    # File exists but empty
    if os.path.getsize(HISTORY_PATH) == 0:
        return 100, 100, 100

    try:
        df = pd.read_csv(HISTORY_PATH)
    except:
        return 100, 100, 100

    if len(df) < 2:
        return 100, 100, 100

    lag_1 = df.iloc[-1]["aqi"]

    lag_24 = (
        df.iloc[-24]["aqi"]
        if len(df) >= 24
        else lag_1
    )

    rolling_mean_24 = df["aqi"].tail(24).mean()

    return lag_1, lag_24, rolling_mean_24
