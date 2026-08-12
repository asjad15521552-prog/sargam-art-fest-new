import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                        </div>
                      )}
                    </div>
                  </div>
                )}"""

dashboard_code = """                        </div>
                      )}

                      {adminTab === 'dashboard' && (
                        <div className="space-y-8">
                          {/* Top Standings */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {adminTeamScoringList.map((team, index) => (
                              <div key={team.name} className={`bg-stone-900 border ${index === 0 ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-amber-500/20'} rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden`}>
                                {index === 0 && <div className="absolute top-0 w-full h-1 bg-amber-500"></div>}
                                {index === 0 && <Trophy className="w-8 h-8 text-amber-500 mb-2 absolute opacity-10 right-4 top-4" />}
                                <h4 className="text-xl font-black text-amber-100">{team.name}</h4>
                                <p className="text-xs font-bold text-amber-500/70 mb-1">{team.malayalam}</p>
                                <div className="text-3xl font-black text-amber-400 mt-2">{team.score}</div>
                                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-500/50 mt-1">Total Points</div>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Category Leaders */}
                            <div className="lg:col-span-2 bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                              <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-amber-500" />
                                Category Standings
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {adminCategoryRankData.map(catData => (
                                  <div key={catData.category} className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                                    <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                      <h4 className="font-bold text-amber-100">{catData.category}</h4>
                                      <span className="text-[10px] text-amber-500/60 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">{catData.malayalam}</span>
                                    </div>
                                    <div className="space-y-2">
                                      {catData.ranking.map((team, idx) => (
                                        <div key={team.team} className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className={`w-4 text-center text-[10px] font-black ${idx === 0 ? 'text-amber-500' : 'text-stone-600'}`}>{idx + 1}</span>
                                            <span className={`text-sm font-bold ${idx === 0 ? 'text-amber-200' : 'text-stone-400'}`}>{team.team}</span>
                                          </div>
                                          <span className={`text-sm font-black ${idx === 0 ? 'text-amber-400' : 'text-stone-500'}`}>{team.total}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Top Individuals */}
                            <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                              <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-500" />
                                Top Individuals
                              </h3>
                              <div className="space-y-4">
                                {adminTopPerformersList.map((student, idx) => (
                                  <div key={student.code} className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                                        {idx + 1}
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-bold text-amber-100 leading-tight">{student.name}</h4>
                                        <p className="text-[10px] text-amber-500/70 font-bold">{student.team} • {student.category}</p>
                                      </div>
                                    </div>
                                    <div className="text-base font-black text-amber-400">
                                      {student.points}
                                    </div>
                                  </div>
                                ))}
                                {adminTopPerformersList.length === 0 && (
                                  <p className="text-sm text-stone-500 text-center py-4">No individual data yet</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}"""

content = content.replace(target, dashboard_code)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Admin dashboard tab added")
