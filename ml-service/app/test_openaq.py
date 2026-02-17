import requests

import os

API_KEY = "db3d265d505d12b4fe2dc45d8ea5a342f6a4fe1752415cec154d9cf0b37cea00"





HEADERS = {"X-API-Key": API_KEY}

# ⭐ Delhi station (US Diplomatic Post)
LOCATION_ID = 2597


# ==================================
# 1️⃣ Get Sensor Mapping
# ==================================
def get_sensor_map():

    url = f"https://api.openaq.org/v3/locations/{LOCATION_ID}"

    r = requests.get(url, headers=HEADERS)

    if r.status_code != 200:
        print("❌ Failed to fetch sensor map")
        return {}

    data = r.json()

    sensors = data["results"][0]["sensors"]

    sensor_map = {}

    for s in sensors:
        sensor_map[s["id"]] = {
            "name": s["parameter"]["name"],
            "units": s["parameter"]["units"]
        }

    return sensor_map


# ==================================
# 2️⃣ Fill Missing Pollutants
# ==================================
def fill_missing_features(features):

    # approximate Delhi averages (can improve later)
    defaults = {
        "PM2.5": 120,
        "PM10": 180,
        "NO2": 35,
        "CO": 1.2,
        "SO2": 10,
        "O3": 25
    }

    for key, value in defaults.items():
        if key not in features:
            features[key] = value

    return features


# ==================================
# 3️⃣ Get Live Measurements
# ==================================
def get_live_measurements():

    sensor_map = get_sensor_map()

    url = f"https://api.openaq.org/v3/locations/{LOCATION_ID}/latest"

    r = requests.get(url, headers=HEADERS)

    if r.status_code != 200:
        print("❌ Failed to fetch live data")
        return {}

    data = r.json()

    features = {}

    print("\n📊 Live Sensor Data:\n")

    for item in data["results"]:

        sid = item["sensorsId"]
        value = item["value"]

        sensor = sensor_map.get(sid)

        if not sensor:
            continue

        parameter = sensor["name"]
        units = sensor["units"]

        print(f"{parameter} = {value} {units}")

        # Map to model features
        if parameter == "pm25":
            features["PM2.5"] = value
        elif parameter == "pm10":
            features["PM10"] = value
        elif parameter == "no2":
            features["NO2"] = value
        elif parameter == "co":
            features["CO"] = value
        elif parameter == "so2":
            features["SO2"] = value
        elif parameter == "o3":
            features["O3"] = value

    # Prevent model crash
    features = fill_missing_features(features)

    return features


# ==================================
# 4️⃣ Optional: List Indian Locations
# ==================================
def list_indian_locations():

    url = "https://api.openaq.org/v3/locations?iso=IN&limit=50"

    r = requests.get(url, headers=HEADERS)
    data = r.json()

    print("\n🇮🇳 Indian Locations:\n")

    for loc in data["results"]:

        lat = loc["coordinates"]["latitude"]
        lon = loc["coordinates"]["longitude"]

        print(
            loc["id"],
            loc["name"],
            f"(lat={lat}, lon={lon})"
        )


# ==================================
# RUN
# ==================================
if __name__ == "__main__":

    print("\n🔵 Live Measurements:")
    features = get_live_measurements()

    print("\n🧠 Model Input Features:")
    print(features)

    # Uncomment if needed
    # list_indian_locations()
