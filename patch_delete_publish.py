import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """    updatedStudents = updatedStudents.map(st => {
      if (st.programResults?.some(r => (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name)) && !processedCodes.has(st.code.toUpperCase())) {
         const filtered = st.programResults.filter(r => (r.programId ? r.programId !== selectedProgram.id : r.programName !== selectedProgram.name));
         const totalPts = filtered.reduce((sum, r) => sum + r.points, 0);
         return { 
           ...st, 
           programResults: filtered, 
           points: totalPts,
           ...(st.event === selectedProgram.name ? { event: '', rank: 0, grade: '' } : {})
         };
      }
      return st;
    });"""

replacement = """    updatedStudents = updatedStudents.map(st => {
      const hasResult = st.programResults?.some(r => (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name)) || (st.event === selectedProgram.name && st.category === selectedProgram.category);
      if (hasResult && !processedCodes.has(st.code.toUpperCase())) {
         const filtered = (st.programResults || []).filter(r => (r.programId ? r.programId !== selectedProgram.id : r.programName !== selectedProgram.name));
         const totalPts = filtered.reduce((sum, r) => sum + r.points, 0);
         return { 
           ...st, 
           programResults: filtered, 
           points: totalPts,
           ...(st.event === selectedProgram.name ? { event: '', rank: 0, grade: '' } : {})
         };
      }
      return st;
    });"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
