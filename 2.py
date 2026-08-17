import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Set random seed for reproducibility
np.random.seed(42)

# Generate expanded dataset with 100 samples
n_samples = 100
ages = np.random.randint(18, 80, n_samples)
tumor_sizes = np.random.uniform(1, 50, n_samples)
mri_scores = np.random.randint(30, 100, n_samples)
headaches = np.random.randint(0, 2, n_samples)
seizures = np.random.randint(0, 2, n_samples)
vision_problems = np.random.randint(0, 2, n_samples)

# Create tumor labels based on features with some correlation
tumor_labels = []
for i in range(n_samples):
    # Higher probability of tumor if multiple symptoms and higher scores
    symptom_count = headaches[i] + seizures[i] + vision_problems[i]
    tumor_prob = (tumor_sizes[i] / 50 * 0.4 + mri_scores[i] / 100 * 0.4 + symptom_count / 3 * 0.2)
    tumor_labels.append("Yes" if tumor_prob > 0.5 else "No")

data = {
    "Age": ages,
    "Tumor_Size_mm": np.round(tumor_sizes).astype(int),
    "MRI_Score": mri_scores,
    "Headache": headaches,
    "Seizure": seizures,
    "Vision_Problem": vision_problems,
    "Tumor": tumor_labels
}

df = pd.DataFrame(data)

# Save to CSV
df.to_csv("brain_tumor_dataset.csv", index=False)

print("Dataset Shape:", df.shape)
print("\nFirst 10 rows:")
print(df.head(10))
print("\nDataset Statistics:")
print(df.describe().astype(int))
print("\nTumor Distribution:")
print(df['Tumor'].value_counts())

# Prepare data for machine learning
X = df[['Age', 'Tumor_Size_mm', 'MRI_Score', 'Headache', 'Seizure', 'Vision_Problem']]
y = (df['Tumor'] == 'Yes').astype(int)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Predictions
y_pred = model.predict(X_test_scaled)

# Evaluation
print("\n" + "="*50)
print("Model Performance Metrics:")
print("="*50)
print(f"Accuracy:  {int(accuracy_score(y_test, y_pred) * 100)}%")
print(f"Precision: {int(precision_score(y_test, y_pred) * 100)}%")
print(f"Recall:    {int(recall_score(y_test, y_pred) * 100)}%")
print(f"F1 Score:  {int(f1_score(y_test, y_pred) * 100)}%")

print("\nFeature Importance:")
for feature, importance in zip(X.columns, model.feature_importances_):
    print(f"  {feature}: {int(importance * 100)}%")