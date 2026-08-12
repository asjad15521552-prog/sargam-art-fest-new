import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

with open('view_target.txt', 'r') as f:
    target_ui = f.read()

replacement_ui = """                      {adminTab === 'all_programs' && (
                        <div className="bg-stone-900 border border-amber-500/20 p-6 rounded-2xl space-y-4 overflow-x-auto">
                          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-amber-500/10 pb-3 gap-4">
                            <h4 className="text-amber-300 font-bold flex items-center gap-2">
                              <List className="w-5 h-5" /> All Programs Overview
                            </h4>
                            <div className="relative w-full md:w-72">
                              <input 
                                type="text" 
                                placeholder="Search by code or name..." 
                                value={adminAllProgramsSearchQuery}
                                onChange={(e) => setAdminAllProgramsSearchQuery(e.target.value)}
                                className="w-full bg-stone-950 border border-amber-500/30 rounded-xl py-2 pl-9 pr-4 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                              />
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                            </div>
                          </div>
                            
                          <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                              <tr className="border-b border-stone-800 text-stone-400">
                                <th className="p-3 font-bold">Code</th>
                                <th className="p-3 font-bold">Program Name</th>
                                <th className="p-3 font-bold">Category</th>
                                <th className="p-3 font-bold text-center">Participants</th>
                                <th className="p-3 font-bold">Point Scorers</th>
                                <th className="p-3 font-bold">Team Points</th>
                                <th className="p-3 font-bold text-center">Dashboard Publish</th>
                                <th className="p-3 font-bold text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {programs.filter(prog => 
                                !adminAllProgramsSearchQuery || 
                                prog.name.toLowerCase().includes(adminAllProgramsSearchQuery.toLowerCase()) || 
                                (prog.code && prog.code.toLowerCase().includes(adminAllProgramsSearchQuery.toLowerCase()))
                              ).map(prog => {"""

if target_ui in content:
    content = content.replace(target_ui, replacement_ui)
    print("UI replaced successfully.")
else:
    print("UI target not found.")

with open('src/App.tsx', 'w') as f:
    f.write(content)
