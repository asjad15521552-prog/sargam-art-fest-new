import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                                            <div className="flex items-center gap-2">
                                              <span className="text-[11px] bg-stone-950 border border-stone-800 px-2 py-1 rounded text-stone-400 font-bold">
                                                {registrations.filter(r => r.programId === prog.id).length}/{(prog.category === 'General' && prog.maxParticipantsPerGroup) ? prog.maxParticipantsPerGroup * 5 : 10}
                                              </span>
                                              <button 
                                                onClick={() => handleDeleteProgram(prog.id)}
                                                className="p-1.5 text-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Program"
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </button>
                                            </div>"""

replacement = """                                            <div className="flex items-center gap-2">
                                              <button 
                                                onClick={() => {
                                                  const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isResultPublished: !p.isResultPublished } : p);
                                                  saveAndSetPrograms(updatedPrograms);
                                                  showToast(prog.isResultPublished ? 'Result hidden from public.' : 'Result published to public view.', 'success');
                                                }}
                                                className={`p-1.5 rounded-lg transition-colors ${prog.isResultPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                                                title={prog.isResultPublished ? "Result is Public" : "Result is Hidden"}
                                              >
                                                {prog.isResultPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                              </button>
                                              <span className="text-[11px] bg-stone-950 border border-stone-800 px-2 py-1 rounded text-stone-400 font-bold">
                                                {registrations.filter(r => r.programId === prog.id).length}/{(prog.category === 'General' && prog.maxParticipantsPerGroup) ? prog.maxParticipantsPerGroup * 5 : 10}
                                              </span>
                                              <button 
                                                onClick={() => handleDeleteProgram(prog.id)}
                                                className="p-1.5 text-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Program"
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </button>
                                            </div>"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Program list toggle patched")
