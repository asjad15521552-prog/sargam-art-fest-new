import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                      {adminTab === 'check_publish' && (
                        <div className="bg-stone-900 border border-amber-500/20 p-6 rounded-2xl space-y-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-amber-500/10 pb-4 mb-4 gap-4">
                            <h4 className="text-xl font-bold flex items-center gap-2 text-amber-300">
                              <CheckCircle className="w-5 h-5" /> Check Publish
                            </h4>
                          </div>
                          <div className="text-stone-400">
                              <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                  <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-50" />
                                    Overall Standings
                                  </h3>
                                </div>
                                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                                  <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                    <h4 className="font-bold text-amber-100">Live Points</h4>
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
                          </div>
                        </div>
                      )}"""

replacement = """                      {adminTab === 'check_publish' && (
                        <div className="bg-stone-900 border border-amber-500/20 p-6 rounded-2xl space-y-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-amber-500/10 pb-4 mb-4 gap-4">
                            <h4 className="text-xl font-bold flex items-center gap-2 text-amber-300">
                              <CheckCircle className="w-5 h-5" /> Check Publish
                            </h4>
                          </div>
                          <div className="text-stone-400 space-y-6">
                              <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                  <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-50" />
                                    Overall Standings (Simulated)
                                  </h3>
                                </div>
                                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                                  <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                    <h4 className="font-bold text-amber-100">Live + Simulated Points</h4>
                                  </div>
                                  <div className="space-y-2">
                                    {TEAMS.map(team => {
                                      let score = 0;
                                      const simPublishedIds = simRows.filter(r => r.isPublished && r.selectedProgramId).map(r => r.selectedProgramId);
                                      students.forEach(student => {
                                        if (student.team === team && student.programResults) {
                                          student.programResults.forEach(r => {
                                            const prog = programs.find(p => p.id === r.programId || p.name === r.programName);
                                            if (prog && (prog.isResultPublished || simPublishedIds.includes(prog.id))) {
                                              score += r.points;
                                            }
                                          });
                                        }
                                      });
                                      return { name: team, score };
                                    }).sort((a, b) => b.score - a.score).map((team, idx) => (
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

                              {/* Simulator Table */}
                              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 overflow-hidden">
                                <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                                  <Activity className="w-5 h-5 text-amber-50" />
                                  Simulation Table
                                </h3>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-stone-900 text-stone-400">
                                      <tr>
                                        <th className="px-4 py-3 rounded-tl-xl w-32">Program Code</th>
                                        <th className="px-4 py-3">Program Name</th>
                                        <th className="px-4 py-3">Team Points</th>
                                        <th className="px-4 py-3 rounded-tr-xl text-center w-28">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-800">
                                      {simRows.map((row, index) => {
                                        const selectedProg = programs.find(p => p.id === row.selectedProgramId);
                                        
                                        // Calculate Team Points for this program
                                        const teamPoints: Record<string, number> = {};
                                        if (selectedProg) {
                                          students.forEach(s => {
                                            if (s.programResults) {
                                              s.programResults.forEach(r => {
                                                if (r.programId === selectedProg.id || r.programName === selectedProg.name) {
                                                  teamPoints[s.team] = (teamPoints[s.team] || 0) + r.points;
                                                }
                                              });
                                            }
                                          });
                                        }

                                        return (
                                          <tr key={row.id} className="hover:bg-stone-900 transition-colors">
                                            <td className="px-4 py-3">
                                              <input
                                                type="text"
                                                value={row.programCode}
                                                placeholder="Code..."
                                                className="bg-stone-900 border border-stone-800 rounded-lg p-2 text-amber-100 outline-none focus:border-amber-500/50 w-24 uppercase font-mono text-xs"
                                                onChange={(e) => {
                                                  const code = e.target.value.toUpperCase();
                                                  const matchedProg = programs.find(p => p.code?.toUpperCase() === code);
                                                  
                                                  setSimRows(prev => prev.map(r => 
                                                    r.id === row.id 
                                                      ? { ...r, programCode: code, selectedProgramId: matchedProg ? matchedProg.id : null, isPublished: false }
                                                      : r
                                                  ));
                                                }}
                                              />
                                            </td>
                                            <td className="px-4 py-3 text-amber-100 font-bold text-xs">
                                              {selectedProg ? selectedProg.name : <span className="text-stone-600 font-normal italic">Enter code...</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                              {selectedProg ? (
                                                <div className="flex flex-wrap gap-2 text-[10px]">
                                                  {Object.entries(teamPoints).map(([t, p]) => (
                                                    <span key={t} className="bg-stone-900 px-2 py-1 rounded text-amber-400 font-bold border border-stone-800">
                                                      {t}: {p}
                                                    </span>
                                                  ))}
                                                  {Object.keys(teamPoints).length === 0 && <span className="text-stone-500 italic">No results</span>}
                                                </div>
                                              ) : (
                                                <span className="text-stone-600">-</span>
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              <button
                                                disabled={!selectedProg}
                                                onClick={() => {
                                                  setSimRows(prev => prev.map(r => 
                                                    r.id === row.id ? { ...r, isPublished: !r.isPublished } : r
                                                  ));
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors w-full ${
                                                  !selectedProg 
                                                    ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                                                    : row.isPublished 
                                                    ? 'bg-amber-500 text-stone-950 hover:bg-amber-400' 
                                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                                }`}
                                              >
                                                {row.isPublished ? 'Published' : 'Publish'}
                                              </button>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                          </div>
                        </div>
                      )}"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced UI")
else:
    print("Not found UI")

with open('src/App.tsx', 'w') as f:
    f.write(content)
