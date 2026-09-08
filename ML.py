import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

np.random.seed(42)

def generate_synthetic_data(n_samples=2000):
    hour_of_day = np.random.randint(0, 24, n_samples)
    temperature = np.random.normal(28, 6, n_samples)
    num_appliances = np.random.randint(1, 15, n_samples)
    previous_usage = np.random.normal(5, 1.5, n_samples)
    previous_usage = np.clip(previous_usage, 0.5, None)

    heat_load = np.where(temperature > 25, (temperature - 25) * 0.35, 0)
    evening_peak = np.where((hour_of_day >= 18) & (hour_of_day <= 22), 1.8, 0)
    morning_peak = np.where((hour_of_day >= 6) & (hour_of_day <= 9), 0.9, 0)

    consumption = (
        1.0
        + heat_load
        + num_appliances * 0.35
        + evening_peak
        + morning_peak
        + previous_usage * 0.4
        + np.random.normal(0, 0.6, n_samples)
    )

    consumption = np.clip(consumption, 0.3, None)

    return pd.DataFrame({
        "temperature_C": temperature,
        "num_appliances": num_appliances,
        "hour_of_day": hour_of_day,
        "previous_usage_kWh": previous_usage,
        "consumption_kWh": consumption
    })

df = generate_synthetic_data()

print("Dataset:")
print(df.head())

print("\nDataset Shape:")
print(df.shape)

print("\nDataset Information:")
print(df.info())

print("\nStatistical Summary:")
print(df.describe().round(0).astype(int))

features = [
    "temperature_C",
    "num_appliances",
    "hour_of_day",
    "previous_usage_kWh"
]

target = "consumption_kWh"

X = df[features]
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

lin_model = LinearRegression()

lin_model.fit(X_train_scaled, y_train)

lin_preds = lin_model.predict(X_test_scaled)

rf_model = RandomForestRegressor(
    n_estimators=200,
    max_depth=8,
    random_state=42
)

rf_model.fit(X_train, y_train)

rf_preds = rf_model.predict(X_test)

def evaluate(name, y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)

    print(
        f"{name:>20} | "
        f"MAE: {mae:.3f} kWh | "
        f"RMSE: {rmse:.3f} kWh | "
        f"R²: {r2:.3f}"
    )

    return mae, rmse, r2

print("\nModel Performance:")

evaluate(
    "Linear Regression",
    y_test,
    lin_preds
)

evaluate(
    "Random Forest",
    y_test,
    rf_preds
)

print("\nRandom Forest Feature Importance:")

for feature, importance in sorted(
    zip(features, rf_model.feature_importances_),
    key=lambda x: -x[1]
):
    print(f"{feature:<25} {importance:.3f}")

plt.figure(figsize=(7, 5))

plt.scatter(
    y_test,
    rf_preds,
    alpha=0.5,
    label="Random Forest"
)

plt.scatter(
    y_test,
    lin_preds,
    alpha=0.3,
    label="Linear Regression"
)

lims = [
    min(y_test.min(), rf_preds.min(), lin_preds.min()),
    max(y_test.max(), rf_preds.max(), lin_preds.max())
]

plt.plot(
    lims,
    lims,
    "k--",
    label="Perfect Prediction"
)

plt.xlabel("Actual Consumption (kWh)")
plt.ylabel("Predicted Consumption (kWh)")
plt.title("Actual vs Predicted Consumption")
plt.legend()
plt.grid(True)
plt.show()

importances = rf_model.feature_importances_
order = np.argsort(importances)

plt.figure(figsize=(8, 5))

plt.barh(
    np.array(features)[order],
    importances[order]
)

plt.xlabel("Importance")
plt.ylabel("Features")
plt.title("Random Forest Feature Importance")
plt.grid(axis="x")
plt.show()

appliance_counts = df["num_appliances"].value_counts().sort_index()

plt.figure(figsize=(7, 7))

plt.pie(
    appliance_counts,
    labels=appliance_counts.index,
    autopct="%1.1f%%"
)

plt.title("Distribution of Number of Appliances")
plt.show()

hour_consumption = df.groupby(
    "hour_of_day"
)["consumption_kWh"].mean()

plt.figure(figsize=(10, 5))

plt.plot(
    hour_consumption.index,
    hour_consumption.values,
    marker="o"
)

plt.xlabel("Hour of Day")
plt.ylabel("Average Consumption (kWh)")
plt.title("Average Electricity Consumption by Hour")
plt.grid(True)
plt.show()

plt.figure(figsize=(8, 5))

plt.scatter(
    df["temperature_C"],
    df["consumption_kWh"],
    alpha=0.5
)

plt.xlabel("Temperature (°C)")
plt.ylabel("Consumption (kWh)")
plt.title("Temperature vs Electricity Consumption")
plt.grid(True)
plt.show()

appliance_consumption = df.groupby(
    "num_appliances"
)["consumption_kWh"].mean()

plt.figure(figsize=(9, 5))

plt.bar(
    appliance_consumption.index,
    appliance_consumption.values
)

plt.xlabel("Number of Appliances")
plt.ylabel("Average Consumption (kWh)")
plt.title("Number of Appliances vs Average Consumption")
plt.grid(axis="y")
plt.show()

new_reading = pd.DataFrame([{
    "temperature_C": 33,
    "num_appliances": 8,
    "hour_of_day": 19,
    "previous_usage_kWh": 6.2
}])

predicted = rf_model.predict(new_reading)[0]

print(
    f"\nExample Prediction: "
    f"33°C, 8 appliances, 7 PM, previous usage = 6.2 kWh"
)

print(f"Predicted Consumption: {predicted:.2f} kWh")

print("\nProblem Type: Supervised Learning")
print("Task Type: Regression")
print("Target Variable: consumption_kWh")