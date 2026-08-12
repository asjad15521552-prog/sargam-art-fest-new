import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """  const handleDeleteSingleResult = (studentCode: string, programName: string) => {
    if (!window.confirm(`Are you sure you want to delete the result for ${programName}?`)) return;
    
    const updatedStudents = students.map(st => {
      if (st.code.toUpperCase() === studentCode.toUpperCase()) {
         const filtered = (st.programResults || []).filter(r => r.programName !== programName);
         const totalPts = filtered.reduce((sum, r) => sum + r.points, 0);
         return { 
           ...st, 
           programResults: filtered, 
           points: totalPts,
           ...(st.event === programName ? { rank: 0, grade: '' } : {})
         };
      }
      return st;
    });
    saveAndSetStudents(updatedStudents);
    showToast(`Result deleted for ${studentCode}`, 'success');
  };"""

replacement = """  const handleDeleteSingleResult = (studentCode: string, programName: string) => {
    if (!window.confirm(`Are you sure you want to delete the result for ${programName}?`)) return;
    
    const updatedStudents = students.map(st => {
      if (st.code.toUpperCase() === studentCode.toUpperCase()) {
         const updatedResults = (st.programResults || []).map(r => {
           if (r.programName === programName) {
             return { ...r, rank: 0, grade: '', points: 0 };
           }
           return r;
         });
         const totalPts = updatedResults.reduce((sum, r) => sum + r.points, 0);
         return { 
           ...st, 
           programResults: updatedResults, 
           points: totalPts,
           ...(st.event === programName ? { rank: 0, grade: '' } : {})
         };
      }
      return st;
    });
    saveAndSetStudents(updatedStudents);
    showToast(`Result deleted for ${studentCode}`, 'success');
  };"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed")
