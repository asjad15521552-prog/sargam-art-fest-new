import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                      {adminTab === 'dashboard' && (
                        <div className="space-y-8">
                          {/* Top Standings */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {adminTeamScoringList.map((team, index) => ("""

replacement = """                      {adminTab === 'dashboard' && (
                        <div className="space-y-8">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-900 border border-amber-500/20 p-4 rounded-xl">
                            <div>
                              <h3 className="text-amber-300 font-black text-lg flex items-center gap-2">
                                <Activity className="w-5 h-5" /> Live Dashboard
                              </h3>
                              <p className="text-xs text-amber-500/60 font-bold mt-1">
                                {dashboardViewMode === 'admin' 
                                  ? "Currently showing ALL results (including hidden/unpublished)."
                                  : "Currently showing ONLY published results (Public View)."}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/50">View Mode:</span>
                              <button
                                onClick={() => setDashboardViewMode(prev => prev === 'admin' ? 'public' : 'admin')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                                  dashboardViewMode === 'public'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                }`}
                              >
                                {dashboardViewMode === 'public' ? (
                                  <><Eye className="w-4 h-4" /> Public View</>
                                ) : (
                                  <><EyeOff className="w-4 h-4" /> Admin View</>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Top Standings */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {(dashboardViewMode === 'admin' ? adminTeamScoringList : teamScoringList).map((team, index) => ("""

content = content.replace(target, replacement)

target2 = """                                {adminCategoryRankData.map(catData => ("""
replacement2 = """                                {(dashboardViewMode === 'admin' ? adminCategoryRankData : categoryRankData).map(catData => ("""
content = content.replace(target2, replacement2)

target3 = """                                {adminTopPerformersList.map((student, idx) => ("""
replacement3 = """                                {(dashboardViewMode === 'admin' ? adminTopPerformersList : globalTopStudents).map((student, idx) => ("""
content = content.replace(target3, replacement3)

target4 = """                                {adminTopPerformersList.length === 0 && ("""
replacement4 = """                                {(dashboardViewMode === 'admin' ? adminTopPerformersList : globalTopStudents).length === 0 && ("""
content = content.replace(target4, replacement4)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Dashboard toggles patched")
