# STEP 1 - Import pandas  DATA cleaning

import pandas as pd

# STEP 2 - Create messy dataset (added Date + messy City + duplicate row)
data = {
    "CustomerID": [101, 102, 103, 104, 105, 106, 107, 107, 108, 109],
    "Name": ["Amit", "Saran", "John", "None", "Priya", "David", "Meena", "Meena", "Ali", "Riya"],
    "Age": [25, None, 30, 22, None, 28, 35, 35, None, 26],
    "City": [" Bangalore", "Mumbai ", "Delhi", None, "Bangalore", "Chennai", "Mumbai", "Mumbai", "Delhi", " Bangalore "],
    "OrderAmount": [2500, 1800, None, 2200, 3000, None, 1500, 1500, 2700, None],
    "PaymentMethod": ["UPI", "Card", "Cash", "Card", None, "UPI", "Cash", "Cash", "Card", "UPI"],
    "Date": [
        "2024-01-05",
        "2024-01-10",
        "2024-02-01",
        "2024-02-05",
        "2024-03-01",
        "2024-03-05",
        "2024-03-10",
        "2024-03-10",
        "2024-04-01",
        "2024-04-05"
    ]
}

df = pd.DataFrame(data)

# STEP 3 - Inspect dataset
print("First rows:\n", df.head())
print("\nDataset info:")
print(df.info())

# STEP 4 - Check missing values
print("\nMissing values per column:")
print(df.isna().sum())

# STEP 5 - Fill missing values (statistical approach)
df["Age"] = df["Age"].fillna(df["Age"].mean())
df["OrderAmount"] = df["OrderAmount"].fillna(df["OrderAmount"].mean())
df["City"] = df["City"].fillna(df["City"].mode()[0])
df["PaymentMethod"] = df["PaymentMethod"].fillna(df["PaymentMethod"].mode()[0])
df["Name"] = df["Name"].fillna("Unknown")

# STEP 6 - Check data types before conversion
print("\nData types BEFORE conversion:")
print(df.dtypes)

# STEP 7 - Convert data types
df["Age"] = df["Age"].astype(int)
df["Date"] = pd.to_datetime(df["Date"])
print("\nData types AFTER conversion:")
print(df.dtypes)

# NEW PART - STRING CLEANING


# Strip extra spaces from City names
df["City"] = df["City"].str.strip()

# Convert City names to lowercase
df["City"] = df["City"].str.lower()

print("\nCity column after cleaning:")
print(df["City"])

# NEW PART - DUPLICATE HANDLING


# Check duplicate rows
print("\nNumber of duplicate rows:")
print(df.duplicated().sum())

# Remove duplicates
df = df.drop_duplicates()
print("\nShape after removing duplicates:", df.shape)

# FINAL CLEAN DATASET
print("\nFinal cleaned dataset:")
print(df.head())

 # Task



import pandas as pd
import numpy as np

data = {
    "Student_ID": [101, 102, 103, 104, 105, 106, 107, 108,
                   109, 110, 111, 112, 113, 114, 115, 116,
                   105, 108],

    "Name": ["Aarav", "Diya", "Rohan", "Ananya", "Vikram", "Isha",
             "Kabir", "Meera", "Arjun", "Sneha", "Rahul", "Priya",
             np.nan, "Aditya", "Neha", "Karan", "Vikram", "Meera"],

    "Gender": ["M", "F", "M", "F", "M", np.nan, "M", "F",
               "M", "F", "M", "F", "M", "F", "M", "M", "M", "F"],

    "Age": [16, 17, 16, 17, 16, 17, 16, 17,
            np.nan, 16, 17, 16, 17, 16, 16, 16, 16, 17],

    "Math": [85, np.nan, 78, 92, 88, 76, 95, 89,
             81, 90, np.nan, 84, 79, 93, 87, 91, 88, 89],

    "Science": [82, 89, 80, np.nan, 85, 79, 94, 91,
                83, 88, np.nan, 86, 81, 95, 84, 90, 85, 91],

    "English": [88, 91, 84, 95, 86, 80, np.nan, 90,
                85, 92, 78, 87, 83, 94, np.nan, 89, 86, 90]
}

df = pd.DataFrame(data)

df = df.head(10)

print("Original Dataset:")
print(df)

print("\nOriginal Shape:")
print(df.shape)

print("\nMissing Values in Each Column:")
print(df.isnull().sum())

print("\nTotal Missing Values:")
print(df.isnull().sum().sum())

print("\nNumber of Duplicate Rows:")
print(df.duplicated().sum())

print("\nDuplicate Rows:")
print(df[df.duplicated()])

df_clean = df.drop_duplicates()

print("\nShape After Removing Duplicates:")
print(df_clean.shape)

df_clean["Name"] = df_clean["Name"].fillna("Unknown")

df_clean["Gender"] = df_clean["Gender"].fillna(
    df_clean["Gender"].mode()[0]
)

df_clean["Age"] = df_clean["Age"].fillna(
    df_clean["Age"].median()
).astype(int)

for column in ["Math", "Science", "English"]:
    mean_value = round(df_clean[column].mean())
    df_clean[column] = df_clean[column].fillna(mean_value).astype(int)

print("\nCleaned Dataset:")
print(df_clean)

print("\nMissing Values After Cleaning:")
print(df_clean.isnull().sum())

print("\nFinal Shape of Cleaned Dataset:")
print(df_clean.shape)
print(df)