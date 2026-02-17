import pandas as pd
import os

current_dir = os.path.dirname(__file__)
file_path = os.path.join(current_dir, "..", "data", "city_hour.csv")

df = pd.read_csv(file_path)

print("Columns:\n", df.columns)
print("\nFirst 5 rows:\n", df.head())
print("\nInfo:\n")
print(df.info())
print("\nMissing values:\n", df.isnull().sum())
