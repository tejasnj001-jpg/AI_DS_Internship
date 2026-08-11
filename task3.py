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

print("Matrix A:")
print(A)

print("\nMatrix B:")
print(B)

# Matrix multiplication
Result = np.dot(A, B)

print("\nMatrix Multiplication using np.dot():")
print(Result)

# Element-wise multiplication
Element = A * B

print("\nElement-wise Multiplication using *:")
print(Element)

# Shape of result
print("\nShape of Matrix Multiplication:", Result.shape)
print("Shape of Element-wise Multiplication:", Element.shape)

# Swap matrices
Swap_Result = np.dot(B, A)

print("\nAfter Swapping Matrices (B dot A):")
print(Swap_Result)