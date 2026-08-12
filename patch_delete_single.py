import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add handleDeleteSingleResult
target_func = """  const handleDeleteProgramResults = () => {"""
replacement_func = """  const handleDeleteSingleResult = (studentCode: string, programName: string) => {
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
  };

  const handleDeleteProgramResults = () => {"""

if target_func in content:
    content = content.replace(target_func, replacement_func)
    print("Added function")

# Add button
target_btn = """                                                            <button 
                                                              onClick={() => startEditResult(s, eventName, result)}
                                                              className="p-1 hover:bg-amber-500/20 text-amber-500/50 hover:text-amber-400 rounded transition-colors ml-auto flex items-center gap-1"
                                                              title="Edit this Result"
                                                            >
                                                              <Edit className="w-3 h-3" />
                                                            </button>"""

replacement_btn = """                                                            <div className="flex items-center gap-1 ml-auto">
                                                              <button 
                                                                onClick={() => startEditResult(s, eventName, result)}
                                                                className="p-1 hover:bg-amber-500/20 text-amber-500/50 hover:text-amber-400 rounded transition-colors flex items-center gap-1"
                                                                title="Edit this Result"
                                                              >
                                                                <Edit className="w-3 h-3" />
                                                              </button>
                                                              <button 
                                                                onClick={() => handleDeleteSingleResult(s.code, eventName)}
                                                                className="p-1 hover:bg-rose-500/20 text-rose-500/50 hover:text-rose-400 rounded transition-colors flex items-center gap-1"
                                                                title="Delete this Result"
                                                              >
                                                                <Trash2 className="w-3 h-3" />
                                                              </button>
                                                            </div>"""

if target_btn in content:
    content = content.replace(target_btn, replacement_btn)
    print("Added button")

with open('src/App.tsx', 'w') as f:
    f.write(content)
