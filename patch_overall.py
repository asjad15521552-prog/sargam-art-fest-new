import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                                    Overall Standings (Published)
                                  </h3>
                                </div>
                                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                                  <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                    <h4 className="font-bold text-amber-100">Live Points</h4>
                                    <span className="text-[10px] text-amber-500/60 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">Only Published Programs</span>
                                  </div>"""

replacement = """                                    Overall Standings
                                  </h3>
                                </div>
                                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                                  <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                    <h4 className="font-bold text-amber-100">Live Points</h4>
                                  </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced")
else:
    print("Not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
