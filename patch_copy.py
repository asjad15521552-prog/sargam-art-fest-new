import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("Activity, FileText", "Activity, FileText, Copy")

target = r"""                              <h3 className="text-lg font-black text-amber-300 mb-6 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-50" />
                                Overall Standings
                              </h3>"""

replacement = """                              <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                                  <Trophy className="w-5 h-5 text-amber-50" />
                                  Overall Standings
                                </h3>
                                <button
                                  onClick={() => {
                                    const text = `🏆 Overall Standings\n\n` + teamScoringList.map((t, i) => `${i + 1}. ${t.name}: ${t.score} pts`).join('\n');
                                    navigator.clipboard.writeText(text);
                                    showToast('Copied to clipboard', 'success');
                                  }}
                                  className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-400 rounded-lg transition-colors border border-stone-700 flex items-center gap-1.5"
                                  title="Copy Standings"
                                >
                                  <Copy className="w-4 h-4" />
                                  <span className="text-[10px] font-bold">COPY</span>
                                </button>
                              </div>"""

content = re.sub(target, replacement, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
