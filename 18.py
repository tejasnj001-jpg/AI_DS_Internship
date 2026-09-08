import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

np.random.seed(42)

n = 100

study_hours = np.random.randint(1, 11, n)
attendance = np.random.randint(55, 101, n)
assignments = np.random.randint(2, 11, n)
previous_score = np.random.randint(40, 91, n)
sleep_hours = np.random.randint(5, 10, n)

exam_score = (
    study_hours * 3
    + attendance * 0.25
    + assignments * 1.5
    + previous_score * 0.35
    + sleep_hours * 1.5
    + np.random.randint(-10, 11, n)
)

exam_score = np.clip(exam_score, 35, 100).astype(int)

df = pd.DataFrame({
    "Study_Hours": study_hours,
    "Attendance": attendance,
    "Assignments": assignments,
    "Previous_Score": previous_score,
    "Sleep_Hours": sleep_hours,
    "Exam_Score": exam_score
})

print("=" * 60)
print("STUDENT EXAM SCORE PREDICTION")
print("=" * 60)

print("\nDataset:")
print(df)

print("\nShape:")
print(df.shape)

print("\nData Types:")
print(df.dtypes)

print("\nStatistical Summary:")
print(df.describe().round(0).astype(int))

print("\nMissing Values:")
print(df.isnull().sum())

X = df[
    [
        "Study_Hours",
        "Attendance",
        "Assignments",
        "Previous_Score",
        "Sleep_Hours"
    ]
]

y = df["Exam_Score"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining Samples:", len(X_train))
print("Testing Samples:", len(X_test))

lr = LinearRegression()
lr.fit(X_train, y_train)

lr_pred = lr.predict(X_test)

lr_mae = mean_absolute_error(y_test, lr_pred)
lr_mse = mean_squared_error(y_test, lr_pred)
lr_rmse = np.sqrt(lr_mse)
lr_r2 = r2_score(y_test, lr_pred)

print("\n" + "=" * 60)
print("LINEAR REGRESSION")
print("=" * 60)

print("MAE:", round(lr_mae))
print("MSE:", round(lr_mse))
print("RMSE:", round(lr_rmse))
print("R2 Score:", round(lr_r2, 2))

rf = RandomForestRegressor(
    n_estimators=200,
    max_depth=8,
    min_samples_split=4,
    random_state=42
)

rf.fit(X_train, y_train)

rf_pred = rf.predict(X_test)

rf_mae = mean_absolute_error(y_test, rf_pred)
rf_mse = mean_squared_error(y_test, rf_pred)
rf_rmse = np.sqrt(rf_mse)
rf_r2 = r2_score(y_test, rf_pred)

print("\n" + "=" * 60)
print("RANDOM FOREST REGRESSION")
print("=" * 60)

print("MAE:", round(rf_mae))
print("MSE:", round(rf_mse))
print("RMSE:", round(rf_rmse))
print("R2 Score:", round(rf_r2, 2))

comparison = pd.DataFrame({
    "Model": [
        "Linear Regression",
        "Random Forest"
    ],
    "MAE": [
        round(lr_mae),
        round(rf_mae)
    ],
    "MSE": [
        round(lr_mse),
        round(rf_mse)
    ],
    "RMSE": [
        round(lr_rmse),
        round(rf_rmse)
    ],
    "R2 Score": [
        round(lr_r2, 2),
        round(rf_r2, 2)
    ]
})

print("\n" + "=" * 60)
print("MODEL COMPARISON")
print("=" * 60)

print(comparison)

prediction_table = pd.DataFrame({
    "Actual": y_test.values,
    "Predicted": np.round(rf_pred).astype(int)
})

print("\n" + "=" * 60)
print("ACTUAL VS PREDICTED")
print("=" * 60)

print(prediction_table)

cluster_data = df[
    [
        "Study_Hours",
        "Attendance",
        "Assignments",
        "Previous_Score"
    ]
]

kmeans = KMeans(
    n_clusters=3,
    random_state=42,
    n_init=10
)

df["Cluster"] = kmeans.fit_predict(cluster_data)

print("\n" + "=" * 60)
print("UNSUPERVISED LEARNING - K-MEANS CLUSTERING")
print("=" * 60)

cluster_result = df[
    [
        "Study_Hours",
        "Attendance",
        "Assignments",
        "Previous_Score",
        "Exam_Score",
        "Cluster"
    ]
]

print(cluster_result)

cluster_summary = df.groupby("Cluster")[
    [
        "Study_Hours",
        "Attendance",
        "Assignments",
        "Previous_Score",
        "Exam_Score"
    ]
].mean().round(0).astype(int)

print("\nCluster Summary:")
print(cluster_summary)

print("\nCluster Counts:")
print(df["Cluster"].value_counts().sort_index())

plt.figure(figsize=(8, 5))

sns.scatterplot(
    data=df,
    x="Study_Hours",
    y="Exam_Score",
    hue="Cluster",
    s=100
)

plt.title("Student Performance Clusters")
plt.xlabel("Study Hours")
plt.ylabel("Exam Score")
plt.show()

plt.figure(figsize=(8, 5))

plt.scatter(
    y_test,
    np.round(rf_pred).astype(int),
    s=80
)

plt.xlabel("Actual Exam Score")
plt.ylabel("Predicted Exam Score")
plt.title("Actual vs Predicted Exam Scores")

plt.show()

plt.figure(figsize=(8, 5))

plt.plot(
    y_test.values,
    marker="o",
    label="Actual"
)

plt.plot(
    np.round(rf_pred).astype(int),
    marker="o",
    label="Predicted"
)

plt.xlabel("Test Students")
plt.ylabel("Exam Score")
plt.title("Actual vs Predicted Scores")
plt.legend()

plt.show()

plt.figure(figsize=(8, 5))

correlation = df.corr(numeric_only=True)

sns.heatmap(
    correlation,
    annot=True,
    fmt=".2f",
    cmap="coolwarm"
)

plt.title("Correlation Heatmap")
plt.show()

plt.figure(figsize=(7, 5))

df["Cluster"].value_counts().sort_index().plot.pie(
    autopct="%1.0f%%"
)

plt.title("Student Cluster Distribution")
plt.ylabel("")

plt.show()

feature_importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": rf.feature_importances_
})

feature_importance = feature_importance.sort_values(
    by="Importance",
    ascending=False
)

print("\n" + "=" * 60)
print("FEATURE IMPORTANCE")
print("=" * 60)

print(feature_importance)

plt.figure(figsize=(8, 5))

sns.barplot(
    data=feature_importance,
    x="Importance",
    y="Feature"
)

plt.title("Feature Importance - Random Forest")
plt.xlabel("Importance")
plt.ylabel("Feature")

plt.show()

new_student = pd.DataFrame({
    "Study_Hours": [6],
    "Attendance": [85],
    "Assignments": [7],
    "Previous_Score": [72],
    "Sleep_Hours": [8]
})

prediction = rf.predict(new_student)

print("\n" + "=" * 60)
print("NEW STUDENT PREDICTION")
print("=" * 60)

print("Study Hours:", 6)
print("Attendance:", 85)
print("Assignments:", 7)
print("Previous Score:", 72)
print("Sleep Hours:", 8)
print("Predicted Exam Score:", round(prediction[0]))

print("\n" + "=" * 60)
print("ML PROBLEM TYPE")
print("=" * 60)

print("Supervised Learning: Regression")
print("Unsupervised Learning: K-Means Clustering")
print("Target Variable: Exam_Score")
print("Input Variables: Study_Hours, Attendance, Assignments, Previous_Score, Sleep_Hours")

print("\n" + "=" * 60)
print("DATA LEAKAGE")
print("=" * 60)

print("Data leakage occurs if information available only after the exam")
print("is used as an input feature for predicting the Exam_Score.")

print("\n" + "=" * 60)
print("OVERFITTING AND UNDERFITTING")
print("=" * 60)

print("Overfitting: The model learns training data too closely")
print("and performs poorly on new students.")

print("Underfitting: The model is too simple to learn")
print("important patterns in the student data.")