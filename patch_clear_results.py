import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "action: 'reset' | 'clearStudents' | 'clearPrograms' | null",
    "action: 'reset' | 'clearStudents' | 'clearPrograms' | 'clearResults' | null"
)

target_functions = """  const handleClearAllPrograms = () => {
    setClearConfirmState({ isOpen: true, action: 'clearPrograms', password: '', error: '' });
  };"""

replacement_functions = """  const handleClearAllPrograms = () => {
    setClearConfirmState({ isOpen: true, action: 'clearPrograms', password: '', error: '' });
  };

  const handleClearAllResults = () => {
    setClearConfirmState({ isOpen: true, action: 'clearResults', password: '', error: '' });
  };"""

content = content.replace(target_functions, replacement_functions)


target_execute = """    if (clearConfirmState.action === 'reset') {"""

replacement_execute = """    if (clearConfirmState.action === 'clearResults') {
      const updatedStudents = students.map(s => ({
        ...s,
        event: '',
        rank: 0,
        grade: '',
        points: 0,
        programResults: []
      }));
      const updatedPrograms = programs.map(p => ({
        ...p,
        isResultPublished: false,
        isDashboardPublished: false
      }));
      saveAndSetStudents(updatedStudents);
      saveAndSetPrograms(updatedPrograms);
      showToast('All results cleared.', 'success');
    } else if (clearConfirmState.action === 'reset') {"""

content = content.replace(target_execute, replacement_execute)


target_buttons = """                              <button 
                                onClick={handleClearAllPrograms}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold rounded-xl text-xs transition-colors border border-rose-500/20 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 text-rose-400" />
                                <span>Clear All Programs</span>
                              </button>"""

replacement_buttons = """                              <button 
                                onClick={handleClearAllPrograms}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold rounded-xl text-xs transition-colors border border-rose-500/20 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 text-rose-400" />
                                <span>Clear All Programs</span>
                              </button>
                              
                              <button 
                                onClick={handleClearAllResults}
                                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold rounded-xl text-xs transition-colors border border-rose-500/20 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 text-rose-400" />
                                <span>Clear All Results</span>
                              </button>"""

content = content.replace(target_buttons, replacement_buttons)

with open('src/App.tsx', 'w') as f:
    f.write(content)
