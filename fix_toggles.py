with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """                                      <div className="flex flex-col items-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isDashboardPublished: !p.isDashboardPublished } : p);
                                            saveAndSetPrograms(updatedPrograms);
                                            showToast(prog.isDashboardPublished ? 'Hidden from Live Dashboard.' : 'Published to Live Dashboard.', 'success');
                                          }}
                                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${prog.isDashboardPublished ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-stone-800 text-stone-500 border border-stone-700 hover:bg-stone-700'}`}
                                        >
                                          {prog.isDashboardPublished ? <><Activity className="w-3 h-3"/> Dashboard: ON</> : <><Activity className="w-3 h-3"/> Dashboard: OFF</>}
                                        </button>
                                        <button"""

replacement1 = """                                      <div className="flex flex-col items-end gap-2">
                                        <button"""

if target1 in content:
    content = content.replace(target1, replacement1)
else:
    print("Failed to find target1")

target2 = """                                            <div className="flex items-center gap-2">
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
                                              <button"""

replacement2 = """                                            <div className="flex items-center gap-2">
                                              <button"""

if target2 in content:
    content = content.replace(target2, replacement2)
else:
    print("Failed to find target2")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed toggles from result & program tabs")
