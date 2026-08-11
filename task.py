import numpy as np


sales = np.array([
    [100, 150, 200],
    [120, 160, 180],
    [110, 170, 210],
    [130, 140, 190],
    [125, 155, 220]
])

print("Daily Product Sales:")
print(sales)


print("\nProduct-wise Results:")

mean_product = np.mean(sales, axis=0)
median_product = np.median(sales, axis=0)
variance_product = np.var(sales, axis=0)
std_product = np.std(sales, axis=0)

print("Mean:", mean_product)
print("Median:", median_product)
print("Variance:", variance_product)
print("Standard Deviation:", std_product)


print("\nDay-wise Results:")

mean_day = np.mean(sales, axis=1)
median_day = np.median(sales, axis=1)
variance_day = np.var(sales, axis=1)
std_day = np.std(sales, axis=1)

print("Mean:", mean_day)
print("Median:", median_day)
print("Variance:", variance_day)
print("Standard Deviation:", std_day)