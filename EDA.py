import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("iris")

print("FIRST 5 RECORDS")
print(df.head())

print("\nDATASET SHAPE")
print(df.shape)

print("\nDATASET INFORMATION")
print(df.info())

print("\nSTATISTICAL SUMMARY")
print(df.describe())

print("\nMISSING VALUES")
print(df.isnull().sum())

print("\nDUPLICATE VALUES")
print(df.duplicated().sum())

print("\nDUPLICATE ROWS")
print(df[df.duplicated()])

print("\nUNIQUE VALUES")
print(df.nunique())

print("\nVALUE COUNTS OF SPECIES")
print(df["species"].value_counts())

print("\nSKEWNESS")
print(df.select_dtypes(include="number").skew())

print("\nCORRELATION MATRIX")
print(df.select_dtypes(include="number").corr())

Q1 = df.select_dtypes(include="number").quantile(0.25)
Q3 = df.select_dtypes(include="number").quantile(0.75)

IQR = Q3 - Q1

lower_limit = Q1 - 1.5 * IQR
upper_limit = Q3 + 1.5 * IQR

outliers = (
    (df.select_dtypes(include="number") < lower_limit) |
    (df.select_dtypes(include="number") > upper_limit)
)

print("\nOUTLIER COUNT")
print(outliers.sum())

print("\nOUTLIER VALUES")
print(df[outliers.any(axis=1)])

sns.histplot(df["sepal_length"], kde=True)
plt.title("Distribution of Sepal Length")
plt.xlabel("Sepal Length")
plt.ylabel("Frequency")
plt.show()

sns.histplot(df["sepal_width"], kde=True)
plt.title("Distribution of Sepal Width")
plt.xlabel("Sepal Width")
plt.ylabel("Frequency")
plt.show()

sns.histplot(df["petal_length"], kde=True)
plt.title("Distribution of Petal Length")
plt.xlabel("Petal Length")
plt.ylabel("Frequency")
plt.show()

sns.histplot(df["petal_width"], kde=True)
plt.title("Distribution of Petal Width")
plt.xlabel("Petal Width")
plt.ylabel("Frequency")
plt.show()

sns.boxplot(data=df.select_dtypes(include="number"))
plt.title("Box Plot for Numerical Features")
plt.show()

sns.scatterplot(
    data=df,
    x="petal_length",
    y="petal_width",
    hue="species"
)
plt.title("Petal Length vs Petal Width")
plt.show()

sns.scatterplot(
    data=df,
    x="sepal_length",
    y="sepal_width",
    hue="species"
)
plt.title("Sepal Length vs Sepal Width")
plt.show()

sns.pairplot(df, hue="species")
plt.show()

plt.figure(figsize=(8, 6))
sns.heatmap(
    df.select_dtypes(include="number").corr(),
    annot=True,
    cmap="coolwarm"
)
plt.title("Correlation Heatmap")
plt.show()

print("\nPATTERN IDENTIFICATION")

print("1. Petal length and petal width show a strong positive relationship.")

print("2. Petal measurements provide good separation between the different species.")

print("3. Sepal measurements show weaker relationships compared with petal measurements.")

print("4. The dataset contains three species with 50 observations each.")

print("5. Most numerical variables show moderate or low skewness.")

print("6. Box plots can be used to identify potential outliers, especially in sepal width.")

print("7. The correlation matrix shows which numerical features are strongly related.")

print("\nEDA CONCLUSION")

print("The Iris dataset contains 150 observations and 5 columns.")
print("There are four numerical features and one categorical feature.")
print("The dataset does not contain missing values.")
print("Petal length and petal width are strongly correlated.")
print("These two features also provide strong separation between Iris species.")
print("Overall, the dataset is clean and suitable for further analysis and machine learning.")