import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                                                <button 
                                                  onClick={() => {
                                                    const updatedPrograms = programs.map(p => p.id === prog.id ? { ...p, isDashboardPublished: !p.isDashboardPublished } : p);
                                                    saveAndSetPrograms(updatedPrograms);
                                                    showToast(prog.isDashboardPublished ? 'Hidden from Live Dashboard.' : 'Published to Live Dashboard.', 'success');
                                                  }}
                                                  className={`px-2 py-1 rounded-md transition-colors text-[10px] font-bold flex items-center gap-1 ${prog.isDashboardPublished ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700'}`}
                                                  title="Show points in Live Dashboard (Overall Standings)"
                                                >
                                                  <Activity className="w-3 h-3" /> Dashboard: {prog.isDashboardPublished ? 'ON' : 'OFF'}
                                                </button>"""

replacement = """"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced")
else:
    print("Not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
