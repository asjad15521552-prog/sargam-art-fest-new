import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """  const handleSaveResult = (e: React.FormEvent) => {"""

replacement = """  const handleDeleteProgramResults = () => {
    const selectedProgram = programs.find(p => p.id === resultPublishProgramId);
    if (!selectedProgram) {
      showToast('Invalid Program Code', 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete all results for ${selectedProgram.name}?`)) {
      const updatedStudents = students.map(st => {
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
      });
      
      const updatedPrograms = programs.map(p => p.id === selectedProgram.id ? { ...p, isResultPublished: false, isDashboardPublished: false } : p);

      saveAndSetStudents(updatedStudents);
      saveAndSetPrograms(updatedPrograms);
      setResultPublishEntries([{ id: Date.now().toString(), code: '', rank: 0, grade: '' }]);
      showToast(`Deleted all results for ${selectedProgram.name}`, 'success');
    }
  };

  const handleSaveResult = (e: React.FormEvent) => {"""

content = content.replace(target, replacement)

target2 = """                                    <div className="mt-6 pt-4 border-t border-amber-500/20">
                                      <button
                                        type="button"
                                        onClick={handlePublishResults}
                                        className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-amber-950 font-black rounded-xl transition-colors shadow-md text-sm cursor-pointer"
                                      >
                                        Save Results
                                      </button>
                                    </div>"""

replacement2 = """                                    <div className="mt-6 pt-4 border-t border-amber-500/20 flex gap-3">
                                      <button
                                        type="button"
                                        onClick={handleDeleteProgramResults}
                                        className="flex-1 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-black rounded-xl transition-colors shadow-md text-sm border border-rose-500/20 cursor-pointer"
                                      >
                                        Delete Result
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handlePublishResults}
                                        className="flex-[2] py-3 bg-amber-600 hover:bg-amber-500 text-amber-950 font-black rounded-xl transition-colors shadow-md text-sm cursor-pointer"
                                      >
                                        Save Results
                                      </button>
                                    </div>"""

content = content.replace(target2, replacement2)

with open('src/App.tsx', 'w') as f:
    f.write(content)
