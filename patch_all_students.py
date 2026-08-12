import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                          <div className="space-y-8">
                            {students.length === 0 ? (
                              <div className="text-center p-6 text-amber-500/50 bg-stone-950/30 rounded-xl border border-stone-800">
                                No students added yet.
                              </div>
                            ) : ("""

replacement = """                          <div className="space-y-8">
                            {students.length === 0 ? (
                              <div className="text-center p-6 text-amber-500/50 bg-stone-950/30 rounded-xl border border-stone-800">
                                No students added yet.
                              </div>
                            ) : (() => {
                              const programsWithResults = new Set<string>();
                              students.forEach(st => {
                                st.programResults?.forEach(r => {
                                  if (r.rank > 0 || r.grade) programsWithResults.add(r.programName);
                                });
                                if (st.event && (st.rank > 0 || st.grade)) {
                                  programsWithResults.add(st.event);
                                }
                              });
                              return (
                                <>"""

content = content.replace(target, replacement)

target2 = """                                      </table>
                                    </div>
                                  </div>
                                );
                              }"""

replacement2 = """                                      </table>
                                    </div>
                                  </div>
                                );
                              })}
                                </>
                              );
                            })()}"""

content = content.replace(target2, replacement2)

target3 = """                                                            ) : (
                                                              <span className="bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-stone-700">Registered</span>
                                                            )}"""

replacement3 = """                                                            ) : (
                                                              programsWithResults.has(eventName) ? (
                                                                <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-rose-500/20">Nil</span>
                                                              ) : (
                                                                <span className="bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-stone-700">Registered</span>
                                                              )
                                                            )}"""

content = content.replace(target3, replacement3)

with open('src/App.tsx', 'w') as f:
    f.write(content)
