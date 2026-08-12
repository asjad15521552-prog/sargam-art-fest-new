with open('src/App.tsx', 'r') as f:
    content = f.read()

target_btn = """                                            <td className="px-4 py-3 text-center">
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
                                            </td>"""

replacement_btn = """                                            <td className="px-4 py-3 text-center">
                                              <button
                                                disabled={!selectedProg}
                                                onClick={() => {
                                                  if (selectedProg) {
                                                    const isSimPublished = simPublishedProgramIds.includes(selectedProg.id);
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
                                                    : (selectedProg && simPublishedProgramIds.includes(selectedProg.id))
                                                    ? 'bg-amber-500 text-stone-950 hover:bg-amber-400' 
                                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                                }`}
                                              >
                                                {(selectedProg && simPublishedProgramIds.includes(selectedProg.id)) ? 'Unpublish' : 'Publish'}
                                              </button>
                                            </td>"""

if target_btn in content:
    content = content.replace(target_btn, replacement_btn)
    print("Replaced button")
else:
    print("Could not find button")

with open('src/App.tsx', 'w') as f:
    f.write(content)
