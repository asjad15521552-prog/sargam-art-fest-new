import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Overall from Public Dashboard (activeTab === 'top3')
target_public = r"          \{activeTab === 'top3' && \(\n            <div className=\"flex flex-col gap-10 w-full\">\n              <div>\n                <h3 className=\"text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2\">\n                  <Award className=\"w-5 h-5\" /> Overall Top Individuals\n                </h3>\n                <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full\">\n                  \{publicGlobalTopStudents\.map\(\(student, rankIndex\) => \(\n                    <motion\.div\n                      key=\{student\.code\}\n                      initial=\{\{ opacity: 0, y: 10 \}\}\n                      animate=\{\{ opacity: 1, y: 0 \}\}\n                      transition=\{\{ delay: rankIndex \* 0\.05 \}\}\n                      className=\"bg-stone-900/60 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between shadow-md relative overflow-hidden group hover:border-amber-500/40 transition-all\"\n                    >\n                      <div className=\{\`absolute top-0 left-0 w-1\.5 h-full \$\{rankIndex === 0 \? 'bg-amber-400' : rankIndex === 1 \? 'bg-stone-300' : rankIndex === 2 \? 'bg-amber-700' : 'bg-stone-800'\}\`\}></div>\n                      <div className=\"flex items-center gap-4 pl-3\">\n                        <div className=\{\`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-lg font-black \$\{rankIndex === 0 \? 'bg-amber-400 text-amber-950 shadow-\[0_0_15px_rgba\(251,191,36,0\.6\)\]' : rankIndex === 1 \? 'bg-stone-300 text-amber-950' : rankIndex === 2 \? 'bg-amber-700 text-amber-100' : 'bg-stone-800 text-stone-400'\}\`\}>\n                          \{rankIndex \+ 1\}\n                        </div>\n                        <div>\n                          <div className=\"font-bold text-amber-100 text-base leading-tight\">\{student\.name\}</div>\n                          <div className=\"text-xs text-amber-500/70 font-medium mt-1\">\{student\.team\} • \{student\.category\}</div>\n                        </div>\n                      </div>\n                      <div className=\"font-black text-2xl text-amber-300 text-right pr-2\">\n                        \{student\.points\} <span className=\"text-xs text-amber-500/60 font-bold uppercase block -mt-1\">pts</span>\n                      </div>\n                    </motion\.div>\n                  \)\}\n                  \{publicGlobalTopStudents\.length === 0 && \(\n                    <div className=\"col-span-full text-center py-8 text-amber-50/40 border border-dashed border-amber-500/10 rounded-xl\">\n                      No results published yet\n                    </div>\n                  \)\}\n                </div>\n              </div>\n              \n              <div>\n                <h3 className=\"text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2\">\n                  <Layers className=\"w-5 h-5\" /> Top Individuals By Category\n                </h3>"

new_public = """          {activeTab === 'top3' && (
            <div className="flex flex-col gap-10 w-full">
              <div>
                <h3 className="text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-5 h-5" /> Top Individuals By Category
                </h3>"""
content = re.sub(target_public, new_public, content)

# 2. Add Overall and Category to Admin Dashboard
target_admin = r"                            \{/\* Category Leaders \*/\}\n                            <div className=\"lg:col-span-2 bg-stone-900 border border-amber-500/20 rounded-2xl p-6\">\n                              <h3 className=\"text-lg font-black text-amber-300 mb-6 flex items-center gap-2\">\n                                <Layers className=\"w-5 h-5 text-amber-50\" />\n                                Category Standings\n                              </h3>\n                              <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n                                \{categoryRankData\.map\(catData => \(\n                                  <div key=\{catData\.category\} className=\"bg-stone-950 p-4 rounded-xl border border-stone-800\">\n                                    <div className=\"flex items-center justify-between mb-3 border-b border-stone-800 pb-2\">\n                                      <h4 className=\"font-bold text-amber-100\">\{catData\.category\}</h4>\n                                      <span className=\"text-\[10px\] text-amber-500/60 font-bold bg-amber-500/10 px-2 py-0\.5 rounded-full\">\{catData\.malayalam\}</span>\n                                    </div>\n                                    <div className=\"space-y-2\">\n                                      \{catData\.ranking\.map\(\(team, idx\) => \(\n                                        <div key=\{team\.team\} className=\"flex items-center justify-between\">\n                                          <div className=\"flex items-center gap-2\">\n                                            <span className=\{\`w-4 text-center text-\[10px\] font-black \$\{idx === 0 \? 'text-amber-50' : 'text-stone-600'\}\`\}>\{idx \+ 1\}</span>\n                                            <span className=\{\`text-sm font-bold \$\{idx === 0 \? 'text-stone-400' : 'text-stone-400'\}\`\}>\{team\.team\}</span>\n                                          </div>\n                                          <span className=\{\`text-sm font-black \$\{idx === 0 \? 'text-amber-400' : 'text-stone-500'\}\`\}>\{team\.total\}</span>\n                                        </div>\n                                      \)\)\}\n                                    </div>\n                                  </div>\n                                \)\)\}\n                              </div>\n                            </div>\n                          </div>"

new_admin = """                            {/* Category Leaders */}
                            <div className="lg:col-span-2 bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                              <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-amber-50" />
                                Category Standings
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categoryRankData.map(catData => (
                                  <div key={catData.category} className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                                    <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                      <h4 className="font-bold text-amber-100">{catData.category}</h4>
                                      <span className="text-[10px] text-amber-500/60 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">{catData.malayalam}</span>
                                    </div>
                                    <div className="space-y-2">
                                      {catData.ranking.map((team, idx) => (
                                        <div key={team.team} className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className={`w-4 text-center text-[10px] font-black ${idx === 0 ? 'text-amber-50' : 'text-stone-600'}`}>{idx + 1}</span>
                                            <span className={`text-sm font-bold ${idx === 0 ? 'text-stone-400' : 'text-stone-400'}`}>{team.team}</span>
                                          </div>
                                          <span className={`text-sm font-black ${idx === 0 ? 'text-amber-400' : 'text-stone-500'}`}>{team.total}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Overall Top Individuals */}
                            <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                              <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-50" />
                                Overall Top Individuals
                              </h3>
                              <div className="space-y-4">
                                {globalTopStudents.map((student, idx) => (
                                  <div key={student.code} className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-amber-500 text-amber-950' : 'bg-stone-800 text-stone-400'}`}>
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
                                {globalTopStudents.length === 0 && (
                                  <p className="text-sm text-stone-500 text-center py-4">No individual data yet</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Top Individuals By Category */}
                          {topStudentsByCategory.some(c => c.students.length > 0) && (
                            <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                              <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-amber-50" />
                                Top Individuals By Category
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {topStudentsByCategory.map((catData) => (
                                  <div key={catData.category} className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col">
                                    <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                      <h4 className="font-black text-amber-100">{catData.category}</h4>
                                      <span className="text-[10px] text-amber-500/60 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">{catData.malayalam}</span>
                                    </div>
                                    <div className="space-y-2 flex-1">
                                      {catData.students.map((student, idx) => (
                                        <div key={student.code} className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className={`w-4 text-center text-[10px] font-black ${idx === 0 ? 'text-amber-50' : 'text-stone-600'}`}>{idx + 1}</span>
                                            <div>
                                              <div className={`text-sm font-bold leading-tight ${idx === 0 ? 'text-stone-400' : 'text-stone-400'}`}>{student.name}</div>
                                              <div className="text-[9px] text-stone-500">{student.team}</div>
                                            </div>
                                          </div>
                                          <span className={`text-sm font-black ${idx === 0 ? 'text-amber-400' : 'text-stone-500'}`}>{student.points}</span>
                                        </div>
                                      ))}
                                      {catData.students.length === 0 && (
                                        <div className="text-center py-4 text-xs text-stone-500 italic">No data</div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}"""
                          
content = re.sub(target_admin, new_admin, content)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied fixes")
