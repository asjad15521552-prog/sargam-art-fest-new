with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. We want to insert "Overall Top Individuals" and "Top Individuals By Category" into the Admin Dashboard.
# The Admin Dashboard ends right before `                          {/* Top By Class */}`
admin_insertion_point = content.find("                          {/* Top By Class */}")

if admin_insertion_point != -1:
    admin_content_to_insert = """
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
                          )}
"""
    content = content[:admin_insertion_point] + admin_content_to_insert + content[admin_insertion_point:]
    print("Inserted admin content.")
else:
    print("Could not find admin insertion point.")

with open('src/App.tsx', 'w') as f:
    f.write(content)
