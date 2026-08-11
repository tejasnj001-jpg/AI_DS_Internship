import numpy as np

marks = [78, 89, 78, 56]
new_marks = []
for x in marks:
    new_marks.append(x + 5)
print(new_marks)

# Matrix multiplication example
matrix_a = np.array([
    [1, 2, 3],
    [4, 5, 6]
])
matrix_b = np.array([
    [7, 8],
    [9, 10],
    [11, 12]
])

product = matrix_a @ matrix_b
print("\nMatrix A:")
print(matrix_a)
print("\nMatrix B:")
print(matrix_b)
print("\nA x B:")
print(product)

# Transpose examples
print("\nTranspose of A:")
print(matrix_a.T)
print("\nTranspose of B:")
print(matrix_b.T)
print("\nTranspose of A x B:")
print(product.T)

