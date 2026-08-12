import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """  const handleDeleteProgramResults = () => {
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
  };"""

replacement = """  const [confirmDeleteProgramId, setConfirmDeleteProgramId] = useState<string | null>(null);

  const handleDeleteProgramResults = () => {
    const selectedProgram = programs.find(p => p.id === resultPublishProgramId);
    if (!selectedProgram) {
      showToast('Invalid Program Code', 'error');
      return;
    }

    if (confirmDeleteProgramId !== selectedProgram.id) {
      setConfirmDeleteProgramId(selectedProgram.id);
      setTimeout(() => setConfirmDeleteProgramId(null), 3000);
      return;
    }

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
    setConfirmDeleteProgramId(null);
    showToast(`Deleted all results for ${selectedProgram.name}`, 'success');
  };"""

content = content.replace(target, replacement)

target2 = """                                      <button
                                        type="button"
                                        onClick={handleDeleteProgramResults}
                                        className="flex-1 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-black rounded-xl transition-colors shadow-md text-sm border border-rose-500/20 cursor-pointer"
                                      >
                                        Delete Result
                                      </button>"""

replacement2 = """                                      <button
                                        type="button"
                                        onClick={handleDeleteProgramResults}
                                        className={`flex-1 py-3 font-black rounded-xl transition-colors shadow-md text-sm border cursor-pointer ${confirmDeleteProgramId === resultPublishProgramId ? 'bg-rose-600 text-white border-rose-500' : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'}`}
                                      >
                                        {confirmDeleteProgramId === resultPublishProgramId ? 'Click to Confirm' : 'Delete Result'}
                                      </button>"""

content = content.replace(target2, replacement2)

with open('src/App.tsx', 'w') as f:
    f.write(content)
