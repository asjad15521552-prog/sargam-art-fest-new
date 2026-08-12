import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """              {topStudentsByClass.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Top Students By Class
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                    {topStudentsByClass.map((classData, classIndex) => (
                      <motion.div
                        key={classData.className}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: classIndex * 0.05 }}
                        className="bg-stone-900/60 border border-amber-500/20 rounded-2xl p-5 flex flex-col shadow-md h-full"
                      >
                        <div className="text-center mb-6 border-b border-amber-500/10 pb-3">
                          <h3 className="text-xl font-black text-amber-300">Class {classData.className}</h3>
                        </div>
                        <div className="space-y-4 flex-1">
                          {classData.students.map((student, rankIndex) => (
                            <div key={student.code} className="flex items-center justify-between bg-stone-950/50 p-3 rounded-xl border border-amber-500/10 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                              <div className={`absolute top-0 left-0 w-1 h-full ${rankIndex === 0 ? 'bg-amber-400' : rankIndex === 1 ? 'bg-stone-300' : rankIndex === 2 ? 'bg-amber-700' : 'bg-stone-800'}`}></div>
                              <div className="flex items-center gap-3 pl-2">
                                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-black ${rankIndex === 0 ? 'bg-amber-400 text-stone-950 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : rankIndex === 1 ? 'bg-stone-300 text-stone-950' : rankIndex === 2 ? 'bg-amber-700 text-amber-100' : 'bg-stone-800 text-stone-500'}`}>
                                  {rankIndex + 1}
                                </div>
                                <div>
                                  <div className="font-bold text-amber-100 text-sm leading-tight">{student.name}</div>
                                  <div className="text-[10px] text-amber-500/70 font-medium mt-0.5">{student.team} • {student.code}</div>
                                </div>
                              </div>
                              <div className="font-black text-lg text-amber-300 text-right">
                                {student.points} <span className="text-[10px] text-amber-500/60 font-bold uppercase block -mt-1">pts</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}"""

if target1 in content:
    content = content.replace(target1, "")
else:
    print("Failed to find target1")

target2 = """                              <div className="space-y-4">
                                {globalTopStudents.map((student, idx) => (
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
                                {globalTopStudents.length === 0 && (
                                  <p className="text-sm text-stone-500 text-center py-4">No individual data yet</p>
                                )}
                              </div>
                            </div>
                          </div>"""

replacement2 = """                              <div className="space-y-4">
                                {globalTopStudents.map((student, idx) => (
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
                                {globalTopStudents.length === 0 && (
                                  <p className="text-sm text-stone-500 text-center py-4">No individual data yet</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Top By Class */}
                          {topStudentsByClass.length > 0 && (
                            <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                              <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-500" />
                                Top Students By Class
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {topStudentsByClass.map((classData) => (
                                  <div key={classData.className} className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col">
                                    <h4 className="font-black text-amber-100 mb-3 text-center border-b border-stone-800 pb-2">Class {classData.className}</h4>
                                    <div className="space-y-2 flex-1">
                                      {classData.students.map((student, idx) => (
                                        <div key={student.code} className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className={`w-4 text-center text-[10px] font-black ${idx === 0 ? 'text-amber-500' : 'text-stone-600'}`}>{idx + 1}</span>
                                            <div>
                                              <div className={`text-sm font-bold leading-tight ${idx === 0 ? 'text-amber-200' : 'text-stone-400'}`}>{student.name}</div>
                                              <div className="text-[9px] text-stone-500">{student.team}</div>
                                            </div>
                                          </div>
                                          <span className={`text-sm font-black ${idx === 0 ? 'text-amber-400' : 'text-stone-500'}`}>{student.points}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}"""

if target2 in content:
    content = content.replace(target2, replacement2)
else:
    print("Failed to find target2")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Moved top students by class to live dashboard")
