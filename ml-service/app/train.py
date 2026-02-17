import pandas as pd
import xgboost as xgb
from sklearn.metrics import mean_squared_error
import joblib
import os
import numpy as np


# Load dataset
# Get absolute path safely
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "city_hour.csv")

df = pd.read_csv(DATA_PATH)

# Convert datetime
df["Datetime"] = pd.to_datetime(df["Datetime"])

# Filter one city
df = df[df["City"] == "Delhi"]

# Sort by time
df = df.sort_values("Datetime")

# Drop rows where AQI is missing
df = df.dropna(subset=["AQI"])

# Select pollutant features
features = ["PM2.5", "PM10", "NO2", "CO", "SO2", "O3"]

df = df.dropna(subset=features)

# Create future target (predict next hour)
df["target"] = df["AQI"].shift(-24)


# Add time-series features
df["lag_1"] = df["AQI"].shift(1)
df["lag_24"] = df["AQI"].shift(24)
df["rolling_mean_24"] = df["AQI"].rolling(24).mean()

df = df.dropna()

# Final feature list
features = features + ["lag_1", "lag_24", "rolling_mean_24"]

# Time-based split
train_size = int(len(df) * 0.8)

train = df[:train_size]
test = df[train_size:]

X_train = train[features]
y_train = train["target"]

X_test = test[features]
y_test = test["target"]

# Model
model = xgb.XGBRegressor(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1
)

model.fit(X_train, y_train)

preds = model.predict(X_test)

comparison = pd.DataFrame({
    "Actual_AQI": y_test.values,
    "Predicted_AQI": preds
})

sample = test.iloc[0]

print("INPUT FEATURES:")
print(sample[features])

print("\nREAL NEXT HOUR AQI:")
print(sample["target"])

print("\nMODEL PREDICTION:")
print(model.predict([sample[features]])[0])



mse = mean_squared_error(y_test, preds)
rmse = np.sqrt(mse)

print("RMSE:", rmse)



# Save model
MODEL_PATH = os.path.join(BASE_DIR, "app", "models", "aqi_model.pkl")
joblib.dump(model, MODEL_PATH)

