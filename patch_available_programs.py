import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """  const existingProgramNames = existingStudentCalc?.programResults?.map(r => r.programName) || [];
  
  let availablePrograms: Program[] = [];
  if (formResultCategory === 'General') {
    const teamRegs = registrations.filter(r => {
      const st = students.find(s => s.code.toUpperCase() === r.studentCode.toUpperCase());
      const regEntryIndex = (r as any).entryIndex || 1;
      return st?.team === formTeam && regEntryIndex === formResultEntryIndex;
    });
    const registeredProgramIds = Array.from(new Set(teamRegs.map(r => r.programId)));
    availablePrograms = programs.filter(p => p.category === 'General' && registeredProgramIds.includes(p.id) && (!existingProgramNames.includes(p.name) || p.name === formEvent));
  } else if (formCode) {
    const studentRegs = registrations.filter(r => r.studentCode.toUpperCase() === formCode.toUpperCase());
    const registeredProgramIds = studentRegs.map(r => r.programId);
    availablePrograms = programs.filter(p => p.category === formResultCategory && registeredProgramIds.includes(p.id) && (!existingProgramNames.includes(p.name) || p.name === formEvent));
  }"""

replacement = """  const existingProgramIds = existingStudentCalc?.programResults?.map(r => r.programId).filter(Boolean) as string[] || [];
  const existingProgramNames = existingStudentCalc?.programResults?.filter(r => !r.programId).map(r => r.programName) || [];
  
  let availablePrograms: Program[] = [];
  if (formResultCategory === 'General') {
    const teamRegs = registrations.filter(r => {
      const st = students.find(s => s.code.toUpperCase() === r.studentCode.toUpperCase());
      const regEntryIndex = (r as any).entryIndex || 1;
      return st?.team === formTeam && regEntryIndex === formResultEntryIndex;
    });
    const registeredProgramIds = Array.from(new Set(teamRegs.map(r => r.programId)));
    availablePrograms = programs.filter(p => p.category === 'General' && registeredProgramIds.includes(p.id) && (!(existingProgramIds.includes(p.id) || existingProgramNames.includes(p.name)) || p.name === formEvent));
  } else if (formCode) {
    const studentRegs = registrations.filter(r => r.studentCode.toUpperCase() === formCode.toUpperCase());
    const registeredProgramIds = studentRegs.map(r => r.programId);
    availablePrograms = programs.filter(p => p.category === formResultCategory && registeredProgramIds.includes(p.id) && (!(existingProgramIds.includes(p.id) || existingProgramNames.includes(p.name)) || p.name === formEvent));
  }"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
