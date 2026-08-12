import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = """    const newResult: StudentResult = {
      code: formCode.trim().toUpperCase(),
      name: formName.trim(),
      team: formTeam,
      category: formCategory,
      class: formClass.trim() || 'N/A',
      event: formEvent.trim(),
      rank: Number(formRank) || 1,
      grade: formGrade.trim().toUpperCase() || 'A',
      points: Number(formPoints) || 0
    };"""

new_logic = """    const newResult: StudentResult = {
      code: formCode.trim().toUpperCase(),
      name: formName.trim(),
      team: formTeam,
      category: formCategory,
      class: formClass.trim() || 'N/A',
      event: formEvent.trim(),
      rank: Number(formRank) || 0,
      grade: formGrade.trim().toUpperCase() || '',
      points: Number(formPoints) || 0
    };"""

content = content.replace(old_logic, new_logic)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
