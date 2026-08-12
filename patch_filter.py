import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """         const updatedResults = (st.programResults || []).map(r => {
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
         };"""

replacement1 = """         const filtered = (st.programResults || []).filter(r => r.programName !== programName);
         const totalPts = filtered.reduce((sum, r) => sum + r.points, 0);
         return { 
           ...st, 
           programResults: filtered, 
           points: totalPts,
           ...(st.event === programName ? { rank: 0, grade: '' } : {})
         };"""

target2 = """         const updatedResults = (st.programResults || []).map(r => {
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
         };"""

replacement2 = """         const filtered = (st.programResults || []).filter(r => (r.programId ? r.programId !== selectedProgram.id : r.programName !== selectedProgram.name));
         const totalPts = filtered.reduce((sum, r) => sum + r.points, 0);
         return { 
           ...st, 
           programResults: filtered, 
           points: totalPts,
           ...(st.event === selectedProgram.name ? { rank: 0, grade: '' } : {})
         };"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Success 1")

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Success 2")
    
with open('src/App.tsx', 'w') as f:
    f.write(content)
