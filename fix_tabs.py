import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update handleSaveStudent to only validate Code and Name.
# Let's replace the validation inside handleSaveStudent:
old_validation = """  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim() || !formEvent.trim()) {
      showToast('Code, Name, and Event are required!', 'error');
      return;
    }"""

new_validation = """  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim()) {
      showToast('Code and Name are required!', 'error');
      return;
    }"""
content = content.replace(old_validation, new_validation)

# 2. Add handleSaveResult function
# We can just inject it after handleSaveStudent
save_student_end = """    saveAndSetStudents(updatedList);
    resetForm();
  };"""

new_save_result = """    saveAndSetStudents(updatedList);
    resetForm();
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formEvent.trim()) {
      showToast('Please select a student and enter the Event Name!', 'error');
      return;
    }
    
    // Find the student
    const existingStudent = students.find(s => s.code.toUpperCase() === formCode.trim().toUpperCase());
    if (!existingStudent) {
      showToast('Student not found. Please add them in Student Details first.', 'error');
      return;
    }

    const updatedResult: StudentResult = {
      ...existingStudent,
      event: formEvent.trim(),
      rank: Number(formRank) || 0,
      grade: formGrade.trim().toUpperCase() || '',
      points: Number(formPoints) || 0
    };

    const updatedList = students.map(s => s.code.toUpperCase() === updatedResult.code ? updatedResult : s);
    saveAndSetStudents(updatedList);
    showToast('Result published successfully!', 'success');
    resetForm();
  };"""
content = content.replace(save_student_end, new_save_result)

# 3. Move the input fields from Student Details to Result Publishing
# Let's extract the fields to move.
fields_to_move = """                            {/* Event Details */}
                            <div className="space-y-1 md:col-span-2 pt-4 border-t border-amber-500/10">
                              <label className="text-xs font-bold text-amber-400 block">Event Name (Competition Name)</label>
                              <input 
                                required
                                type="text"
                                placeholder="e.g., Oppana, Mappilappattu"
                                value={formEvent}
                                onChange={(e) => setFormEvent(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100"
                              />
                            </div>

                            {/* Rank */}
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-amber-400 block">Rank</label>
                              <select
                                value={formRank}
                                onChange={(e) => setFormRank(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 outline-none text-sm text-amber-200"
                              >
                                {[1, 2, 3, 4, 5, 0].map(r => (
                                  <option key={r} value={r}>{r === 0 ? 'No Rank / Participated' : `Rank ${r}`}</option>
                                ))}
                              </select>
                            </div>

                            {/* Grade */}
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-amber-400 block">Grade</label>
                              <input 
                                type="text"
                                placeholder="e.g., A, B, A+"
                                value={formGrade}
                                onChange={(e) => setFormGrade(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none uppercase text-sm text-amber-100"
                              />
                            </div>

                            {/* Points */}
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold text-amber-400 block">Points</label>
                              <input 
                                type="number"
                                min="0"
                                max="100"
                                value={formPoints}
                                onChange={(e) => setFormPoints(Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100 font-bold"
                              />
                            </div>"""

if fields_to_move in content:
    content = content.replace(fields_to_move, "")
else:
    print("Warning: fields_to_move not found perfectly. Trying regex.")
    import re
    # Remove it manually
    content = re.sub(r'\{/\* Event Details \*/\}.*?\{/\* Points \*/\}.*?</div>\s*</div>', '</div>', content, flags=re.DOTALL)


old_result_publishing = """                      {adminTab === 'result_publishing' && (
                        <div className="bg-stone-900 border border-amber-500/20 p-10 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
                          <Trophy className="w-8 h-8 text-amber-500/50" />
                          <h4 className="text-amber-200 font-bold">Result Publishing</h4>
                          <p className="text-xs text-amber-500/70">This section is currently under construction and will be updated later.</p>
                        </div>
                      )}"""

new_result_publishing = """                      {adminTab === 'result_publishing' && (
                        <form onSubmit={handleSaveResult} className="bg-stone-900 border border-amber-500/20 p-5 rounded-2xl shadow-sm space-y-4">
                          <h4 className="text-sm font-bold text-amber-300 border-b border-amber-500/10 pb-2">
                            Publish / Edit Result
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Student Search / Selection */}
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold text-amber-400 block">Student Code (Select Student)</label>
                              <select 
                                required
                                value={formCode}
                                onChange={(e) => {
                                  setFormCode(e.target.value);
                                  const s = students.find(st => st.code === e.target.value);
                                  if (s) {
                                    setFormName(s.name);
                                    setFormEvent(s.event || '');
                                    setFormRank(s.rank || 0);
                                    setFormGrade(s.grade || '');
                                    setFormPoints(s.points || 0);
                                  } else {
                                    setFormName('');
                                    setFormEvent('');
                                    setFormRank(0);
                                    setFormGrade('');
                                    setFormPoints(0);
                                  }
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 outline-none text-sm text-amber-100"
                              >
                                <option value="">-- Select a Student --</option>
                                {students.map(s => (
                                  <option key={s.code} value={s.code}>{s.code} - {s.name} ({s.team})</option>
                                ))}
                              </select>
                            </div>

                            {/* Show Name if selected */}
                            {formCode && (
                              <div className="md:col-span-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                                Selected: <strong>{formName}</strong>
                              </div>
                            )}

                            {/* Event Details */}
                            <div className="space-y-1 md:col-span-2 pt-2">
                              <label className="text-xs font-bold text-amber-400 block">Event Name (Competition Name)</label>
                              <input 
                                required
                                type="text"
                                placeholder="e.g., Oppana, Mappilappattu"
                                value={formEvent}
                                onChange={(e) => setFormEvent(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100"
                              />
                            </div>

                            {/* Rank */}
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-amber-400 block">Rank</label>
                              <select
                                value={formRank}
                                onChange={(e) => setFormRank(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 outline-none text-sm text-amber-200"
                              >
                                {[1, 2, 3, 4, 5, 0].map(r => (
                                  <option key={r} value={r}>{r === 0 ? 'No Rank / Participated' : `Rank ${r}`}</option>
                                ))}
                              </select>
                            </div>

                            {/* Grade */}
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-amber-400 block">Grade</label>
                              <input 
                                type="text"
                                placeholder="e.g., A, B, A+"
                                value={formGrade}
                                onChange={(e) => setFormGrade(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none uppercase text-sm text-amber-100"
                              />
                            </div>

                            {/* Points */}
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold text-amber-400 block">Points</label>
                              <input 
                                type="number"
                                min="0"
                                max="100"
                                value={formPoints}
                                onChange={(e) => setFormPoints(Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm text-amber-100 font-bold"
                              />
                            </div>
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-amber-950 font-black rounded-xl transition-colors shadow-md text-sm cursor-pointer mt-4"
                          >
                            Publish Result
                          </button>
                        </form>
                      )}"""

content = content.replace(old_result_publishing, new_result_publishing)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
