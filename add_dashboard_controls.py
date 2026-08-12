with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                      {adminTab === 'dashboard' && (
                        <div className="space-y-8">
                          {/* Top Standings */}"""

replacement = """                      {adminTab === 'dashboard' && (
                        <div className="space-y-8">
                          {/* Live Dashboard Publishing Controls */}
                          <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                            <h3 className="text-lg font-black text-amber-300 mb-4 flex items-center gap-2">
                              <Activity className="w-5 h-5 text-amber-500" />
                              Live Dashboard Program Controls
                            </h3>
                            <p className="text-sm text-amber-500/70 mb-6">Toggle which programs should be included in the live dashboard public score calculation.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {programs.map(prog => (
                                <div key={prog.id} className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex items-center justify-between group hover:border-amber-500/30 transition-colors">
                                  <div className="overflow-hidden pr-3">
                                    <h4 className="text-sm font-bold text-amber-100 truncate">{prog.name}</h4>
                                    <p className="text-[10px] text-stone-500 font-medium truncate">{prog.category} • {prog.type}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isDashboardPublished: !p.isDashboardPublished } : p);
                                      saveAndSetPrograms(updatedPrograms);
                                      showToast(prog.isDashboardPublished ? 'Hidden from Live Dashboard.' : 'Published to Live Dashboard.', 'success');
                                    }}
                                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${prog.isDashboardPublished ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-stone-800 text-stone-500 border border-stone-700 hover:bg-stone-700'}`}
                                  >
                                    <Activity className="w-3.5 h-3.5" />
                                    {prog.isDashboardPublished ? 'ON' : 'OFF'}
                                  </button>
                                </div>
                              ))}
                              {programs.length === 0 && (
                                <div className="col-span-full text-center py-6 text-sm text-stone-500 border border-dashed border-stone-800 rounded-xl">
                                  No programs created yet.
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Top Standings */}"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("Failed to find target")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added dashboard controls")
