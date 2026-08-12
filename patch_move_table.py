import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target_dashboard = """                            <div className="flex flex-col gap-6">
                              {/* Overall Standings 1 */}
                              <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                  <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-50" />
                                    Overall Standings (Dashboard ON)
                                  </h3>

                                </div>
                                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                                  <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                    <h4 className="font-bold text-amber-100">Live Points</h4>
                                    <span className="text-[10px] text-amber-500/60 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">Only Dashboard Programs</span>
                                  </div>
                                  <div className="space-y-2">
                                    {teamScoringList.map((team, idx) => (
                                      <div key={team.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <span className={`w-4 text-center text-[10px] font-black ${idx === 0 ? 'text-amber-50' : 'text-stone-600'}`}>{idx + 1}</span>
                                          <span className={`text-sm font-bold ${idx === 0 ? 'text-stone-400' : 'text-stone-400'}`}>{team.name}</span>
                                        </div>
                                        <span className={`text-sm font-black ${idx === 0 ? 'text-amber-400' : 'text-stone-500'}`}>{team.score}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                                
                              {/* Overall Standings 2 */}"""

replacement_dashboard = """                            <div className="flex flex-col gap-6">
                              {/* Overall Standings 2 */}"""

if target_dashboard in content:
    content = content.replace(target_dashboard, replacement_dashboard)
    print("Dashboard replaced.")
else:
    print("Dashboard target not found.")

with open('src/App.tsx', 'w') as f:
    f.write(content)
