import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                            {students.length === 0 ? (
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
                                <>
                              {TEAMS.map(team => {"""

replacement = """                            {students.length === 0 ? (
                              <div className="text-center p-6 text-amber-500/50 bg-stone-950/30 rounded-xl border border-stone-800">
                                No students added yet.
                              </div>
                            ) : (() => {
                              const publishedProgramIds = new Set<string>();
                              const publishedProgramNames = new Set<string>();
                              students.forEach(st => {
                                st.programResults?.forEach(r => {
                                  if (r.rank > 0 || r.grade) {
                                    if (r.programId) publishedProgramIds.add(r.programId);
                                    else publishedProgramNames.add(r.programName);
                                  }
                                });
                                if (st.event && (st.rank > 0 || st.grade)) {
                                  publishedProgramNames.add(st.event);
                                }
                              });
                              return (
                                <>
                              {TEAMS.map(team => {"""

content = content.replace(target, replacement)

target2 = """                                                        return (
                                                          <div key={i} className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-xs text-amber-200/80">{eventName}</span>
                                                            {result && (result.rank > 0 || result.grade) ? (
                                                              <div className="flex items-center gap-1.5">
                                                                {result.rank > 0 && <span className="bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-bold border border-amber-500/20">Rank {result.rank}</span>}
                                                                {result.grade && <span className="bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-bold border border-emerald-500/20">{result.grade}</span>}
                                                                <span className="bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded text-[9px] font-bold border border-blue-500/20">{result.points || 0} Pts</span>
                                                              </div>
                                                            ) : (
                                                              programsWithResults.has(eventName) ? (
                                                                <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-rose-500/20">Nil</span>
                                                              ) : (
                                                                <span className="bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-stone-700">Registered</span>
                                                              )
                                                            )}
                                                            <button """

replacement2 = """                                                        let isPublished = false;
                                                        let progId = result?.programId;
                                                        if (!progId) {
                                                          const reg = stRegs.find(r => programs.find(p => p.id === r.programId)?.name === eventName);
                                                          if (reg) {
                                                            progId = reg.programId;
                                                          } else {
                                                            const prog = programs.find(p => p.name === eventName && (p.category === s.category || p.category === 'General'));
                                                            if (prog) progId = prog.id;
                                                          }
                                                        }
                                                        if (progId && publishedProgramIds.has(progId)) {
                                                          isPublished = true;
                                                        } else if (publishedProgramNames.has(eventName)) {
                                                          isPublished = true;
                                                        }

                                                        return (
                                                          <div key={i} className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-xs text-amber-200/80">{eventName}</span>
                                                            {result && (result.rank > 0 || result.grade) ? (
                                                              <div className="flex items-center gap-1.5">
                                                                {result.rank > 0 && <span className="bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-bold border border-amber-500/20">Rank {result.rank}</span>}
                                                                {result.grade && <span className="bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-bold border border-emerald-500/20">{result.grade}</span>}
                                                                <span className="bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded text-[9px] font-bold border border-blue-500/20">{result.points || 0} Pts</span>
                                                              </div>
                                                            ) : (
                                                              isPublished ? (
                                                                <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-rose-500/20">Nil</span>
                                                              ) : (
                                                                <span className="bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-stone-700">Registered</span>
                                                              )
                                                            )}
                                                            <button """

content = content.replace(target2, replacement2)

with open('src/App.tsx', 'w') as f:
    f.write(content)
