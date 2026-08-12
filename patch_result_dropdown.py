import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = r"""                            <div>
                              <label className="text-xs font-bold text-amber-400 block mb-1">Select Program</label>
                              <select
                                required
                                value=\{resultPublishProgramId\}
                                onChange=\{\(e\) => setResultPublishProgramId\(e\.target\.value\)\}
                                className="w-full max-w-xs px-4 py-3 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm font-bold text-amber-100"
                              >
                                <option value="" className="bg-stone-900 text-stone-400">-- Select a Program --</option>
                                \{programs\.map\(p => \(
                                  <option key=\{p\.id\} value=\{p\.id\} className="bg-stone-900 text-amber-100">
                                    \{p\.code \? `\[\$\{p\.code\}\] ` : ''\}\{p\.name\}
                                  </option>
                                \)\)\}
                              </select>
                            </div>"""

replacement = """                            <div className="relative max-w-xs" ref={resultPublishDropdownRef}>
                              <label className="text-xs font-bold text-amber-400 block mb-1">Select Program</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Type code or name..."
                                  value={resultPublishSearchQuery}
                                  onChange={(e) => {
                                    setResultPublishSearchQuery(e.target.value);
                                    if (!showResultPublishDropdown) setShowResultPublishDropdown(true);
                                    if (e.target.value === '') setResultPublishProgramId('');
                                  }}
                                  onFocus={() => setShowResultPublishDropdown(true)}
                                  className="w-full px-4 py-3 rounded-xl border border-amber-500/20 bg-stone-950 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20 outline-none text-sm font-bold text-amber-100 placeholder-stone-500"
                                />
                                {resultPublishSearchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setResultPublishSearchQuery('');
                                      setResultPublishProgramId('');
                                      setShowResultPublishDropdown(true);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              
                              {showResultPublishDropdown && (
                                <div className="absolute z-50 w-full mt-1 bg-stone-900 border border-amber-500/20 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                  {programs.filter(p => {
                                    const searchLower = resultPublishSearchQuery.toLowerCase();
                                    return (p.code?.toLowerCase() || '').includes(searchLower) || p.name.toLowerCase().includes(searchLower);
                                  }).map(p => (
                                    <div
                                      key={p.id}
                                      onClick={() => {
                                        setResultPublishProgramId(p.id);
                                        setResultPublishSearchQuery(`${p.code ? `[${p.code}] ` : ''}${p.name}`);
                                        setShowResultPublishDropdown(false);
                                      }}
                                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-stone-800 transition-colors ${resultPublishProgramId === p.id ? 'bg-amber-500/10 text-amber-300 font-bold' : 'text-amber-100'}`}
                                    >
                                      {p.code ? <span className="text-amber-500/60 mr-1.5">[{p.code}]</span> : null}
                                      {p.name}
                                    </div>
                                  ))}
                                  {programs.filter(p => {
                                    const searchLower = resultPublishSearchQuery.toLowerCase();
                                    return (p.code?.toLowerCase() || '').includes(searchLower) || p.name.toLowerCase().includes(searchLower);
                                  }).length === 0 && (
                                    <div className="px-4 py-3 text-sm text-stone-500 text-center">No programs found</div>
                                  )}
                                </div>
                              )}
                            </div>"""

content = re.sub(target, replacement, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
