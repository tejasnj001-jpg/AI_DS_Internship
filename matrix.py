import numpy as np

# Matrix A
A = np.array([
    [1, 2],
    [3, 4]
])

# Matrix B
B = np.array([
    [5, 6],
    [7, 8]
])

# Matrix multiplication
Result = np.dot(A, B)

print("Matrix A:")
print(A)

print("\nMatrix B:")
print(B)

print("\nMatrix Multiplication:")
print(Result)
#transpose




import numpy as np

A = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

print("Original Matrix:")
print(A)

print("\nTranspose:")
print(A.T)

# for determinant
import numpy as np

A = np.array([
    [1, 2],
    [3, 4]
])

det = np.linalg.det(A)

print("Matrix:")
print(A)

print("Determinant:", det)
# for inverse
import numpy as np

A = np.array([
    [1, 2],
    [3, 4]
])
# for inverse
inverse = np.linalg.inv(A)

print("Matrix:")
print(A)

print("Inverse:")
print(inverse)