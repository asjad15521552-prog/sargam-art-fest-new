import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"                            \{/\* Top Individuals \*/\}\n                            <div className=\"bg-stone-900 border border-amber-500/20 rounded-2xl p-6\">\n                              <h3 className=\"text-lg font-black text-amber-300 mb-6 flex items-center gap-2\">\n                                <Award className=\"w-5 h-5 text-amber-50\" />\n                                Top Individuals\n                              </h3>\n                              <div className=\"space-y-4\">\n                                \{globalTopStudents\.map\(\(student, idx\) => \(\n                                  <div key=\{student\.code\} className=\"bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center justify-between\">\n                                    <div className=\"flex items-center gap-3\">\n                                      <div className=\{\`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black \$\{idx === 0 \? 'bg-amber-500 text-amber-950' : 'bg-stone-800 text-stone-400'\}\`\}>\n                                        \{idx \+ 1\}\n                                      </div>\n                                      <div>\n                                        <h4 className=\"text-sm font-bold text-amber-100 leading-tight\">\{student\.name\}</h4>\n                                        <p className=\"text-\[10px\] text-amber-500/70 font-bold\">\{student\.team\} • \{student\.category\}</p>\n                                      </div>\n                                    </div>\n                                    <div className=\"text-base font-black text-amber-400\">\n                                      \{student\.points\}\n                                    </div>\n                                  </div>\n                                \)\)\}\n                                \{globalTopStudents\.length === 0 && \(\n                                  <p className=\"text-sm text-stone-500 text-center py-4\">No individual data yet</p>\n                                \)\}\n                              </div>\n                            </div>"

content = re.sub(target, "", content)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed Overall Top Individuals from Admin Dashboard")
