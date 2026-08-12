import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """<span className="text-emerald-400 font-bold">{student.points} pts {student.grade && `• Grade ${student.grade}`} {student.rank > 0 && `• Rank ${student.rank}`}</span>"""
replacement = """<span className="text-emerald-400 font-bold">{calculateStudentPoints(student, true)} pts {student.grade && `• Grade ${student.grade}`} {student.rank > 0 && `• Rank ${student.rank}`}</span>"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Search pts patched")
