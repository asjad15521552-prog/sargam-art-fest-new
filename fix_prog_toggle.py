import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                    <h5 className="text-lg font-black text-amber-300">{prog.name}</h5>
                                    <p className="text-xs font-bold text-amber-500 mt-1">Category: {prog.category} | Type: {prog.type}</p>"""

replacement = """                                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h5 className="text-lg font-black text-amber-300">{prog.name}</h5>
                                        <p className="text-xs font-bold text-amber-500 mt-1">Category: {prog.category} | Type: {prog.type}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isResultPublished: !p.isResultPublished } : p);
                                          saveAndSetPrograms(updatedPrograms);
                                          showToast(prog.isResultPublished ? 'Result hidden from public.' : 'Result published to public view.', 'success');
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${prog.isResultPublished ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                                      >
                                        {prog.isResultPublished ? <><Eye className="w-3.5 h-3.5"/> Public</> : <><EyeOff className="w-3.5 h-3.5"/> Hidden</>}
                                      </button>
                                    </div>"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Program toggle patched")
