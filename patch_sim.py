import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update simRows state
target_state = """const [simRows, setSimRows] = useState<{id: string, programCode: string, selectedProgramId: string | null}[]>(
    Array.from({length: 10}, (_, i) => ({
      id: `sim-${i}`,
      programCode: '',
      selectedProgramId: null
    }))
  );
  const [simPublishedProgramIds, setSimPublishedProgramIds] = useState<string[]>([]);"""

replacement_state = """const [simRows, setSimRows] = useState<{id: string, programCode: string, selectedProgramId: string | null, isPublished: boolean}[]>(
    Array.from({length: 10}, (_, i) => ({
      id: `sim-${i}`,
      programCode: '',
      selectedProgramId: null,
      isPublished: false
    }))
  );"""

content = content.replace(target_state, replacement_state)

# 2. Update simPublishedIds variable inside TEAMS.map
target_sim_ids = "const simPublishedIds = simPublishedProgramIds;"
replacement_sim_ids = "const simPublishedIds = simRows.filter(r => r.isPublished && r.selectedProgramId).map(r => r.selectedProgramId);"
content = content.replace(target_sim_ids, replacement_sim_ids)

# 3. Update onChange to respect isPublished
target_onchange = """                                                onChange={(e) => {
                                                  const code = e.target.value.toUpperCase();
                                                  const matchedProg = programs.find(p => p.code?.toUpperCase() === code);
                                                  
                                                  setSimRows(prev => prev.map(r => 
                                                    r.id === row.id 
                                                      ? { ...r, programCode: code, selectedProgramId: matchedProg ? matchedProg.id : null }
                                                      : r
                                                  ));
                                                }}"""

replacement_onchange = """                                                onChange={(e) => {
                                                  const code = e.target.value.toUpperCase();
                                                  const matchedProg = programs.find(p => p.code?.toUpperCase() === code);
                                                  
                                                  setSimRows(prev => prev.map(r => {
                                                    if (r.id === row.id) {
                                                      if (r.isPublished) {
                                                        return { ...r, programCode: code };
                                                      }
                                                      return { ...r, programCode: code, selectedProgramId: matchedProg ? matchedProg.id : null };
                                                    }
                                                    return r;
                                                  }));
                                                }}"""
content = content.replace(target_onchange, replacement_onchange)

# 4. Update isSimPublished usage and publish button logic
target_btn = """                                        const isSimPublished = selectedProg && simPublishedProgramIds.includes(selectedProg.id);
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
                                                  
                                                  setSimRows(prev => prev.map(r => {
                                                    if (r.id === row.id) {
                                                      if (r.isPublished) {
                                                        return { ...r, programCode: code };
                                                      }
                                                      return { ...r, programCode: code, selectedProgramId: matchedProg ? matchedProg.id : null };
                                                    }
                                                    return r;
                                                  }));
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
                                                  if (selectedProg) {
                                                    if (isSimPublished) {
                                                      setSimPublishedProgramIds(prev => prev.filter(id => id !== selectedProg.id));
                                                    } else {
                                                      setSimPublishedProgramIds(prev => [...prev, selectedProg.id]);
                                                    }
                                                  }
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors w-full ${
                                                  !selectedProg 
                                                    ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                                                    : isSimPublished 
                                                    ? 'bg-amber-500 text-stone-950 hover:bg-amber-400' 
                                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                                }`}
                                              >
                                                {isSimPublished ? 'Unpublish' : 'Publish'}
                                              </button>
                                            </td>
                                          </tr>
                                        );"""

replacement_btn = """                                        return (
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
                                                  
                                                  setSimRows(prev => prev.map(r => {
                                                    if (r.id === row.id) {
                                                      if (r.isPublished) {
                                                        return { ...r, programCode: code };
                                                      }
                                                      return { ...r, programCode: code, selectedProgramId: matchedProg ? matchedProg.id : null };
                                                    }
                                                    return r;
                                                  }));
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
                                                  if (selectedProg) {
                                                    setSimRows(prev => prev.map(r => {
                                                      if (r.id === row.id) {
                                                        const isNowPublished = !r.isPublished;
                                                        if (!isNowPublished) {
                                                          // When unpublishing, re-evaluate selectedProgramId based on current input text
                                                          const matchedProg = programs.find(p => p.code?.toUpperCase() === r.programCode);
                                                          return { ...r, isPublished: false, selectedProgramId: matchedProg ? matchedProg.id : null };
                                                        }
                                                        return { ...r, isPublished: isNowPublished };
                                                      }
                                                      return r;
                                                    }));
                                                  }
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors w-full ${
                                                  !selectedProg 
                                                    ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                                                    : row.isPublished 
                                                    ? 'bg-amber-500 text-stone-950 hover:bg-amber-400' 
                                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                                }`}
                                              >
                                                {row.isPublished ? 'Unpublish' : 'Publish'}
                                              </button>
                                            </td>
                                          </tr>
                                        );"""

content = content.replace(target_btn, replacement_btn)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Patched simRows")
