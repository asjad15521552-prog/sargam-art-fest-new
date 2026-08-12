import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add startEditResult function
start_edit_func = """  const startEditStudent = (student: StudentResult) => {
    setEditingCode(student.code);
    setFormCode(student.code);
    setFormName(student.name);
    setFormTeam(student.team as TeamName);
    setFormCategory(student.category as CategoryName);
    setFormClass(student.class);
    setFormEvent(student.event);
    setFormRank(student.rank);
    setFormGrade(student.grade);
    setFormPoints(student.points);
    
    // Switch tab to student details
    setAdminTab('student_details');
    
    // Scroll form into view gently
    setTimeout(() => {
      const adminFormEl = document.getElementById('admin-form-anchor');
      if (adminFormEl) {
        adminFormEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    showToast(`${student.name} Ready to edit results for`);
  };"""

new_edit_funcs = """  const startEditStudent = (student: StudentResult) => {
    setEditingCode(student.code);
    setFormCode(student.code);
    setFormName(student.name);
    setFormTeam(student.team as TeamName);
    setFormCategory(student.category as CategoryName);
    setFormClass(student.class);
    setFormEvent(student.event);
    setFormRank(student.rank);
    setFormGrade(student.grade);
    setFormPoints(student.points);
    
    // Switch tab to student details
    setAdminTab('student_details');
    
    // Scroll form into view gently
    setTimeout(() => {
      const adminFormEl = document.getElementById('admin-form-anchor');
      if (adminFormEl) {
        adminFormEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    showToast(`Editing Details for ${student.name}`);
  };

  const startEditResult = (student: StudentResult) => {
    setEditingCode(student.code);
    setFormCode(student.code);
    setFormName(student.name);
    setFormEvent(student.event);
    setFormRank(student.rank);
    setFormGrade(student.grade);
    setFormPoints(student.points);
    
    // Switch tab to result publishing
    setAdminTab('result_publishing');
    
    // Scroll form into view gently
    setTimeout(() => {
      const adminFormEl = document.getElementById('admin-form-anchor');
      if (adminFormEl) {
        adminFormEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    showToast(`Publishing Result for ${student.name}`);
  };"""

content = content.replace(start_edit_func, new_edit_funcs)

# 2. Update the buttons in the "student_list" tab
old_buttons = """                                        <div className="flex justify-end gap-2">
                                          <button 
                                            onClick={() => startEditStudent(s)}
                                            className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors border border-amber-500/20"
                                            title="Edit"
                                          >
                                            <Edit className="w-4 h-4" />
                                          </button>
                                          <button 
                                            onClick={() => handleDeleteStudent(s.code)}
                                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>"""

new_buttons = """                                        <div className="flex justify-end gap-2">
                                          <button 
                                            onClick={() => startEditStudent(s)}
                                            className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg transition-colors border border-amber-500/20 flex items-center gap-1"
                                            title="Edit Details"
                                          >
                                            <User className="w-3.5 h-3.5" /> <span className="text-[10px] uppercase font-bold hidden sm:inline">Details</span>
                                          </button>
                                          <button 
                                            onClick={() => startEditResult(s)}
                                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/20 flex items-center gap-1"
                                            title="Edit Result"
                                          >
                                            <Trophy className="w-3.5 h-3.5" /> <span className="text-[10px] uppercase font-bold hidden sm:inline">Result</span>
                                          </button>
                                          <button 
                                            onClick={() => handleDeleteStudent(s.code)}
                                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20 flex items-center"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>"""

content = content.replace(old_buttons, new_buttons)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
