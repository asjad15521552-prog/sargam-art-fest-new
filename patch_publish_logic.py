import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                                    <td className="p-3 text-center">
                                      <button
                                        onClick={() => {
                                          const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isDashboardPublished: !p.isDashboardPublished } : p);
                                          saveAndSetPrograms(updatedPrograms);
                                          showToast(prog.isDashboardPublished ? 'Unpublished from Public Dashboard' : 'Published to Public Dashboard', 'success');
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${prog.isDashboardPublished ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                                      >
                                        {prog.isDashboardPublished ? 'Unpublish' : 'Publish'}
                                      </button>
                                    </td>
                                    <td className="p-3 text-center">
                                      {prog.isDashboardPublished ? (
                                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/20">Published</span>
                                      ) : (
                                        <span className="bg-stone-800 text-stone-400 px-2 py-1 rounded text-[10px] font-bold border border-stone-700">Unpublished</span>
                                      )}
                                    </td>"""

replacement = """                                    <td className="p-3 text-center">
                                      <button
                                        onClick={() => {
                                          const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isResultPublished: !p.isResultPublished } : p);
                                          saveAndSetPrograms(updatedPrograms);
                                          showToast(prog.isResultPublished ? 'Unpublished from Public Dashboard' : 'Published to Public Dashboard', 'success');
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${prog.isResultPublished ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                                      >
                                        {prog.isResultPublished ? 'Unpublish' : 'Publish'}
                                      </button>
                                    </td>
                                    <td className="p-3 text-center">
                                      {prog.isResultPublished ? (
                                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/20">Published</span>
                                      ) : (
                                        <span className="bg-stone-800 text-stone-400 px-2 py-1 rounded text-[10px] font-bold border border-stone-700">Unpublished</span>
                                      )}
                                    </td>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced publish logic")
else:
    print("Publish logic target not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
