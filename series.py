import pandas as pd

s1 = pd.Series([10, 20, 30, 40])
s2 = pd.Series([10, 20, 30], index=['a', 'b', 'c'])

print(s1)
print(s2)


#indexing

import numpy as np
import pandas as pd   

marks = pd.Series([85, 90, 78], index=['math', 'physics', 'chemistry'])

print(marks['math'])              
print(marks[['math', 'chemistry']])

#selection
import numpy as np
import pandas as pd

marks = pd.Series([85, 56, 80], index=['math', 'physics', 'English'])

print(marks['math'])
print(marks[['math', 'English']])


print(marks[marks > 70])



#task

import pandas as pd


marks = pd.Series(
    [75, 55, 82, 68, 45],
    index=["Maths", "Physics", "Chemistry", "English", "Computer"]
)


print("Value at position 0:", marks.iloc[0])
print("Value at position 2:", marks.iloc[2])

print("Maths marks:", marks["Maths"])
print("Computer marks:", marks["Computer"])


print("\nValues:")
print(marks.values)

print("\nIndex:")
print(marks.index)


print("\nMarks above 60:")
print(marks[marks > 60])



