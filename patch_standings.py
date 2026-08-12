import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                              {/* Overall Standings 2 */}
                              <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                  <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-50" />
                                    Overall Standings (Search ON)
                                  </h3>

                                </div>
                                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                                  <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                    <h4 className="font-bold text-amber-100">Published Points</h4>
                                    <span className="text-[10px] text-amber-500/60 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">Only Published Programs</span>
                                  </div>
                                  <div className="space-y-2">
                                    {publicTeamScoringList.map((team, idx) => ("""

replacement = """                              {/* Overall Standings 2 */}
                              <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                  <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-amber-50" />
                                    Overall Standings (All Saved)
                                  </h3>

                                </div>
                                <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                                  <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2">
                                    <h4 className="font-bold text-amber-100">All Saved Points</h4>
                                    <span className="text-[10px] text-amber-500/60 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">All Saved Results</span>
                                  </div>
                                  <div className="space-y-2">
                                    {adminTeamScoringList.map((team, idx) => ("""

if target in content:
    content = content.replace(target, replacement)
    print("Success")
else:
    print("Failed")

with open('src/App.tsx', 'w') as f:
    f.write(content)
