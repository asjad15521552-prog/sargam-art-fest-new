import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. In useEffect (around line 319)
target1 = """        let res = s.programResults?.find(r => (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name));
        if (!res && s.event === selectedProgram.name) {
          res = { programName: s.event, rank: s.rank, grade: s.grade, points: s.points };
        }"""
replacement1 = """        let res = s.programResults?.find(r => (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name));
        if (!res && s.event === selectedProgram.name && s.category === selectedProgram.category) {
          res = { programName: s.event, rank: s.rank, grade: s.grade, points: s.points };
        }"""
content = content.replace(target1, replacement1)

# 2. In handlePublishResults, updating record (around line 1283)
target2 = """      updatedStudents[recordIndex] = {
        ...targetRecord,
        programResults: filteredResults,
        points: totalPts,
        event: selectedProgram.name,
        rank: entry.rank,
        grade: entry.grade
      };"""
replacement2 = """      updatedStudents[recordIndex] = {
        ...targetRecord,
        programResults: filteredResults,
        points: totalPts,
        ...(targetRecord.event === selectedProgram.name ? { event: '', rank: 0, grade: '' } : {})
      };"""
content = content.replace(target2, replacement2)

# 3. In handlePublishResults, removing unused (around line 1296)
target3 = """    updatedStudents = updatedStudents.map(st => {
      if (st.programResults?.some(r => (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name)) && !processedCodes.has(st.code.toUpperCase())) {
         const filtered = st.programResults.filter(r => (r.programId ? r.programId !== selectedProgram.id : r.programName !== selectedProgram.name));
         const totalPts = filtered.reduce((sum, r) => sum + r.points, 0);
         return { ...st, programResults: filtered, points: totalPts };
      }
      return st;
    });"""
replacement3 = """    updatedStudents = updatedStudents.map(st => {
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
content = content.replace(target3, replacement3)


with open('src/App.tsx', 'w') as f:
    f.write(content)
