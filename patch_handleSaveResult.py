import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """    const newProgramResult = {
      programName: formEvent.trim(),
      rank: Number(formRank) || 0,
      grade: formGrade.trim().toUpperCase() || '',
      points: Number(formPoints) || 0
    };

    const existingResults = existingStudent.programResults || [];
    const selectedProgram = programs.find(p => p.name === formEvent.trim());
    const existingIndex = existingResults.findIndex(r => (r.programId && selectedProgram ? r.programId === selectedProgram.id : r.programName === formEvent.trim()));"""

replacement = """    const selectedProgram = programs.find(p => p.name === formEvent.trim());
    
    const newProgramResult: any = {
      programName: formEvent.trim(),
      rank: Number(formRank) || 0,
      grade: formGrade.trim().toUpperCase() || '',
      points: Number(formPoints) || 0
    };
    if (selectedProgram) {
      newProgramResult.programId = selectedProgram.id;
    }

    const existingResults = existingStudent.programResults || [];
    const existingIndex = existingResults.findIndex(r => (r.programId && selectedProgram ? r.programId === selectedProgram.id : r.programName === formEvent.trim()));"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
