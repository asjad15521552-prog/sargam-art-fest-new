import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

insert_idx = -1
for i, line in enumerate(lines):
    if "          {activeTab === 'total' && (" in line:
        pass
    if "        {/* --- FOOTER STATEMENT --- */}" in line:
        insert_idx = i - 2
        break

category_code = """
          {activeTab === 'category' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
              {categoryRankData.map((catData, catIndex) => (
                <motion.div
                  key={catData.category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                  className="bg-stone-900/60 border border-amber-500/20 rounded-2xl p-5 flex flex-col shadow-md"
                >
                  <div className="text-center mb-6 border-b border-amber-500/10 pb-3">
                    <h3 className="text-xl font-black text-amber-300">{catData.category}</h3>
                    <p className="text-xs text-amber-500/60 font-medium">{catData.malayalam}</p>
                  </div>
                  <div className="space-y-4 flex-1">
                    {catData.ranking.slice(0, 3).map((teamRank, rankIndex) => (
                      <div key={teamRank.team} className="flex items-center justify-between bg-stone-950/50 p-3 rounded-xl border border-amber-500/10 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                        <div className={`absolute top-0 left-0 w-1 h-full ${rankIndex === 0 ? 'bg-amber-400' : rankIndex === 1 ? 'bg-stone-300' : 'bg-amber-700'}`}></div>
                        <div className="flex items-center gap-3 pl-2">
                          <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-black ${rankIndex === 0 ? 'bg-amber-400 text-stone-950' : rankIndex === 1 ? 'bg-stone-300 text-stone-950' : 'bg-amber-700 text-amber-100'}`}>
                            {rankIndex + 1}
                          </div>
                          <div>
                            <div className="font-bold text-amber-100 text-sm">{teamRank.team}</div>
                          </div>
                        </div>
                        <div className="font-black text-lg text-amber-300">
                          {teamRank.total} <span className="text-[10px] text-amber-500/60 font-bold uppercase">pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
"""

if insert_idx != -1:
    lines.insert(insert_idx, category_code)
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Inserted category tab successfully")
else:
    print("Could not find insertion point")
