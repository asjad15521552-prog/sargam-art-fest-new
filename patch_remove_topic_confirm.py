import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                                          <button
                                            onClick={() => {
                                              if(window.confirm('Are you sure you want to remove this topic?')) {
                                                saveAndSetSongRegistrations(songRegistrations.filter(sr => sr.id !== reg.id));
                                                showToast('Topic removed', 'success');
                                              }
                                            }}
                                            className="p-1.5 bg-stone-950 border border-stone-800 hover:bg-rose-500/20 text-rose-500 rounded-md transition-colors"
                                            title="Delete Topic"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>"""

replacement = """                                          <button
                                            onClick={() => {
                                                saveAndSetSongRegistrations(songRegistrations.filter(sr => sr.id !== reg.id));
                                                showToast('Topic removed', 'success');
                                            }}
                                            className="p-1.5 bg-stone-950 border border-stone-800 hover:bg-rose-500/20 text-rose-500 rounded-md transition-colors"
                                            title="Delete Topic"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
