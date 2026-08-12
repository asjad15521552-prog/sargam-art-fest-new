import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """    // Optionally: remove results for students who are NOT in processedCodes anymore
    // (i.e. if the admin deleted a row from the result publish list)
    updatedStudents = updatedStudents.map(st => {
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

replacement1 = """    // Optionally: remove results for students who are NOT in processedCodes anymore
    // (i.e. if the admin deleted a row from the result publish list)
    updatedStudents = updatedStudents.map(st => {
      const hasResult = st.programResults?.some(r => (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name)) || (st.event === selectedProgram.name && st.category === selectedProgram.category);
      if (hasResult && !processedCodes.has(st.code.toUpperCase())) {
         const updatedResults = (st.programResults || []).map(r => {
           if (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name) {
             return { ...r, rank: 0, grade: '', points: 0 };
           }
           return r;
         });
         const totalPts = updatedResults.reduce((sum, r) => sum + r.points, 0);
         return { 
           ...st, 
           programResults: updatedResults, 
           points: totalPts,
           ...(st.event === selectedProgram.name ? { rank: 0, grade: '' } : {})
         };
      }
      return st;
    });"""

target2 = """    const updatedStudents = students.map(st => {
      const hasResult = st.programResults?.some(r => (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name)) || (st.event === selectedProgram.name && st.category === selectedProgram.category);
      if (hasResult) {
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

replacement2 = """    const updatedStudents = students.map(st => {
      const hasResult = st.programResults?.some(r => (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name)) || (st.event === selectedProgram.name && st.category === selectedProgram.category);
      if (hasResult) {
         const updatedResults = (st.programResults || []).map(r => {
           if (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name) {
             return { ...r, rank: 0, grade: '', points: 0 };
           }
           return r;
         });
         const totalPts = updatedResults.reduce((sum, r) => sum + r.points, 0);
         return { 
           ...st, 
           programResults: updatedResults, 
           points: totalPts,
           ...(st.event === selectedProgram.name ? { rank: 0, grade: '' } : {})
         };
      }
      return st;
    });"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Success 1")
else:
    print("Target 1 not found")
    
if target2 in content:
    content = content.replace(target2, replacement2)
    print("Success 2")
else:
    print("Target 2 not found")
    
with open('src/App.tsx', 'w') as f:
    f.write(content)
