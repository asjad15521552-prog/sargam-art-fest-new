import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

good_insert = """  // Calculate available programs for the result publishing form
  const finalCodeCalc = formResultCategory === 'General' ? 'TEAM-' + formTeam + (formResultEntryIndex > 1 ? `-${formResultEntryIndex}` : '') : formCode;
  const existingStudentCalc = students.find(s => s.code.toUpperCase() === finalCodeCalc.trim().toUpperCase());
  const existingProgramNames = existingStudentCalc?.programResults?.map(r => r.programName) || [];
  
  let availablePrograms: Program[] = [];
  if (formResultCategory === 'General') {
    const teamRegs = registrations.filter(r => {
      const st = students.find(s => s.code.toUpperCase() === r.studentCode.toUpperCase());
      const regEntryIndex = (r as any).entryIndex || 1;
      return st?.team === formTeam && regEntryIndex === formResultEntryIndex;
    });
    const registeredProgramIds = Array.from(new Set(teamRegs.map(r => r.programId)));
    availablePrograms = programs.filter(p => p.category === 'General' && registeredProgramIds.includes(p.id) && !existingProgramNames.includes(p.name));
  } else if (formCode) {
    const studentRegs = registrations.filter(r => r.studentCode.toUpperCase() === formCode.toUpperCase());
    const registeredProgramIds = studentRegs.map(r => r.programId);
    availablePrograms = programs.filter(p => p.category === formResultCategory && registeredProgramIds.includes(p.id) && !existingProgramNames.includes(p.name));
  }

  return ("""

content = content.replace("  return (", good_insert, 1)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Inserted successfully")
