import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = r"""                                  <button
                                    onClick=\{\(\) => \{
                                      const text = `🏆 Overall Standings\\n\\n` \+ teamScoringList\.map\(\(t, i\) => `\$\{i \+ 1\}\. \$\{t\.name\}: \$\{t\.score\} pts`\)\.join\('\\n'\);
                                      navigator\.clipboard\.writeText\(text\);
                                      showToast\('Copied to clipboard', 'success'\);
                                    \}\}
                                    className="p-1\.5 bg-stone-800 hover:bg-stone-700 text-stone-400 rounded-lg transition-colors border border-stone-700 flex items-center gap-1\.5"
                                    title="Copy Standings"
                                  >
                                    <Copy className="w-4 h-4" />
                                    <span className="text-\[10px\] font-bold">COPY</span>
                                  </button>"""

content = re.sub(target, "", content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
