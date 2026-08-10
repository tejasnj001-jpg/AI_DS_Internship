import numpy as np 
marks = np.array ([90,89,70,78])
Result = marks + 5
print (Result)



import numpy as np
x = np.array([
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 10]
])

y = np.array([5, 10, 15])

print(x + y)

#shape
import numpy as np

x = np.array([[2, 1, 1],
              [2, 1, 3]])

print(x.shape)

#flatten
import numpy as np

x = np.array([[2, 1, 1],
              [2, 1, 3]])

print(x.flatten())

#hstack
import numpy as np

x = np.array([[2, 1, 1],
              [2, 1, 3]])

print(np.hstack((x, x)))

#transpose
import numpy as np

x = np.array([[2, 1, 1],
              [2, 1, 3]])

print(x.transpose())
#vstack
import numpy as np

x = np.array([[2, 1, 1],
              [2, 1, 3]])

print(np.vstack((x, x)))
# concatenate
import numpy as np

x = np.array([[2, 1, 1],
              [2, 1, 3]])

print(np.concatenate((x, x)))
import numpy as np

x = np.array([[2, 1, 1],
              [2, 1, 3]])

y = np.array([[2, 3, 4],
              [5, 6, 7]])

print(np.concatenate((x, y), axis=1))

