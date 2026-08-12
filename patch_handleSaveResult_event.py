import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """    const updatedResult: StudentResult = {
      ...existingStudent,
      event: formEvent.trim(),
      rank: Number(formRank) || 0,
      grade: formGrade.trim().toUpperCase() || '',
      points: totalPoints,
      programResults: newResultsList
    };"""

replacement = """    const updatedResult: StudentResult = {
      ...existingStudent,
      points: totalPoints,
      programResults: newResultsList,
      ...(existingStudent.event === formEvent.trim() ? { event: '', rank: 0, grade: '' } : {})
    };"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
