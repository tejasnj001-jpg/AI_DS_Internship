import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score

data = {
    "Income": [25000, 45000, 30000, 70000, 55000, 28000, 80000, 35000, 60000, 40000,
               90000, 32000, 50000, 75000, 27000, 65000, 48000, 85000, 38000, 72000],
    "Credit_Score": [580, 720, 610, 780, 690, 570, 800, 620, 740, 650,
                     820, 600, 680, 790, 560, 750, 700, 810, 630, 770],
    "Loan_Amount": [200000, 150000, 250000, 100000, 180000, 220000, 90000, 240000, 130000, 200000,
                    80000, 230000, 160000, 110000, 260000, 120000, 170000, 95000, 210000, 115000],
    "Employment_Status": [0, 1, 0, 1, 1, 0, 1, 0, 1, 0,
                          1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    "Previous_Payment_History": [1, 1, 0, 1, 1, 0, 1, 0, 1, 0,
                                 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    "Default": [1, 0, 1, 0, 0, 1, 0, 1, 0, 1,
                0, 1, 0, 0, 1, 0, 0, 0, 1, 0]
}

df = pd.DataFrame(data)

print("Dataset:")
print(df)

X = df.drop("Default", axis=1)
y = df["Default"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

model = LogisticRegression()

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:", accuracy)
print("Accuracy Percentage:", accuracy * 100, "%")

cm = confusion_matrix(y_test, y_pred)

print("\nConfusion Matrix:")
print(cm)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

plt.figure(figsize=(6, 4))

sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    xticklabels=["No Default", "Default"],
    yticklabels=["No Default", "Default"]
)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Loan Default - Confusion Matrix")
plt.show()