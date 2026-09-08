# Student Report Program

name = input("Enter student name: ")
roll_no = input("Enter roll number: ")

maths = float(input("Enter Maths marks: "))
science = float(input("Enter Science marks: "))
english = float(input("Enter English marks: "))
computer = float(input("Enter Computer marks: "))
social = float(input("Enter Social Science marks: "))

# Calculate results
total = maths + science + english + computer + social
average = total / 5

# Calculate grade
if average >= 90:
    grade = "A+"
elif average >= 80:
    grade = "A"
elif average >= 70:
    grade = "B"
elif average >= 60:
    grade = "C"
elif average >= 50:
    grade = "D"
else:
    grade = "F"

# Pass or fail
if average >= 35:
    result = "PASS"
else:
    result = "FAIL"

# Display report
print("\n" + "=" * 40)
print("           STUDENT REPORT")
print("=" * 40)
print("Name       :", name)
print("Roll No.   :", roll_no)
print("-" * 40)
print("Maths      :", maths)
print("Science    :", science)
print("English    :", english)
print("Computer   :", computer)
print("Social Sci.:", social)
print("-" * 40)
print("Total      :", total, "/ 500")
print("Average    :", round(average, 2), "%")
print("Grade      :", grade)
print("Result     :", result)
print("=" * 40)