import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"          \{activeTab === 'top3' && \(\n            <div className=\"flex flex-col gap-10 w-full\">\n              <div>\n                <h3 className=\"text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2\">\n                  <Layers className=\"w-5 h-5\" /> Top Individuals By Category\n                </h3>"

new_block = """          {activeTab === 'top3' && (
            <div className="flex flex-col gap-10 w-full">
              <div>
                <h3 className="text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-5 h-5" /> Overall Top Individuals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {publicGlobalTopStudents.map((student, rankIndex) => (
                    <motion.div
                      key={student.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: rankIndex * 0.05 }}
                      className="bg-stone-900/60 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between shadow-md relative overflow-hidden group hover:border-amber-500/40 transition-all"
                    >
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${rankIndex === 0 ? 'bg-amber-400' : rankIndex === 1 ? 'bg-stone-300' : rankIndex === 2 ? 'bg-amber-700' : 'bg-stone-800'}`}></div>
                      <div className="flex items-center gap-4 pl-3">
                        <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-lg font-black ${rankIndex === 0 ? 'bg-amber-400 text-amber-950 shadow-[0_0_15px_rgba(251,191,36,0.6)]' : rankIndex === 1 ? 'bg-stone-300 text-amber-950' : rankIndex === 2 ? 'bg-amber-700 text-amber-100' : 'bg-stone-800 text-stone-400'}`}>
                          {rankIndex + 1}
                        </div>
                        <div>
                          <div className="font-bold text-amber-100 text-base leading-tight">{student.name}</div>
                          <div className="text-xs text-amber-500/70 font-medium mt-1">{student.team} • {student.category}</div>
                        </div>
                      </div>
                      <div className="font-black text-2xl text-amber-300 text-right pr-2">
                        {student.points} <span className="text-xs text-amber-500/60 font-bold uppercase block -mt-1">pts</span>
                      </div>
                    </motion.div>
                  ))}
                  {publicGlobalTopStudents.length === 0 && (
                    <div className="col-span-full text-center py-8 text-amber-50/40 border border-dashed border-amber-500/10 rounded-xl">
                      No results published yet
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-5 h-5" /> Top Individuals By Category
                </h3>"""

content = re.sub(target, new_block, content)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Restored Overall Top Individuals to public home page")
