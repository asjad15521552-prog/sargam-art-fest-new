with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                                            <div className="flex items-center gap-2">
                                              <button 
                                                onClick={() => {
                                                  const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isDashboardPublished: !p.isDashboardPublished } : p);
                                                  saveAndSetPrograms(updatedPrograms);
                                                  showToast(prog.isDashboardPublished ? 'Hidden from Live Dashboard.' : 'Published to Live Dashboard.', 'success');
                                                }}
                                                className={`p-1.5 rounded-lg transition-colors ${prog.isDashboardPublished ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                                                title={prog.isDashboardPublished ? "Dashboard: ON" : "Dashboard: OFF"}
                                              >
                                                {prog.isDashboardPublished ? <Activity className="w-4 h-4" /> : <Activity className="w-4 h-4 opacity-30" />}
                                              </button>
                                              <button 
                                                onClick={() => {
                                                  const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isResultPublished: !p.isResultPublished } : p);
                                                  saveAndSetPrograms(updatedPrograms);
                                                  showToast(prog.isResultPublished ? 'Result hidden from Search.' : 'Result published to Search.', 'success');
                                                }}
                                                className={`p-1.5 rounded-lg transition-colors ${prog.isResultPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                                                title={prog.isResultPublished ? "Search: ON" : "Search: OFF"}
                                              >
                                                {prog.isResultPublished ? <Search className="w-4 h-4" /> : <Search className="w-4 h-4 opacity-30" />}
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

replacement = """                                            <div className="flex flex-col items-end gap-1.5">
                                              <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] bg-stone-950 border border-stone-800 px-2 py-1 rounded text-stone-400 font-bold mr-1">
                                                  Reg: {registrations.filter(r => r.programId === prog.id).length}/{(prog.category === 'General' && prog.maxParticipantsPerGroup) ? prog.maxParticipantsPerGroup * 5 : 10}
                                                </span>
                                                <button 
                                                  onClick={() => handleDeleteProgram(prog.id)}
                                                  className="p-1.5 text-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                  title="Delete Program"
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </button>
                                              </div>
                                              <div className="flex items-center gap-1.5">
                                                <button 
                                                  onClick={() => {
                                                    const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isDashboardPublished: !p.isDashboardPublished } : p);
                                                    saveAndSetPrograms(updatedPrograms);
                                                    showToast(prog.isDashboardPublished ? 'Hidden from Live Dashboard.' : 'Published to Live Dashboard.', 'success');
                                                  }}
                                                  className={`px-2 py-1 rounded-md transition-colors text-[10px] font-bold flex items-center gap-1 ${prog.isDashboardPublished ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                                                  title="Show points in Live Dashboard (Overall Standings)"
                                                >
                                                  <Activity className="w-3 h-3" /> Dashboard: {prog.isDashboardPublished ? 'ON' : 'OFF'}
                                                </button>
                                                <button 
                                                  onClick={() => {
                                                    const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isResultPublished: !p.isResultPublished } : p);
                                                    saveAndSetPrograms(updatedPrograms);
                                                    showToast(prog.isResultPublished ? 'Result hidden from Home Page.' : 'Result published to Home Page.', 'success');
                                                  }}
                                                  className={`px-2 py-1 rounded-md transition-colors text-[10px] font-bold flex items-center gap-1 ${prog.isResultPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                                                  title="Show detailed results in Home Page Search"
                                                >
                                                  <Search className="w-3 h-3" /> Home Page: {prog.isResultPublished ? 'ON' : 'OFF'}
                                                </button>
                                              </div>
                                            </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced program buttons")
else:
    print("Failed to replace program buttons")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
