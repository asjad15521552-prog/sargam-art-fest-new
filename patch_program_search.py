import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                          {/* Registrations List Section */}
                          <div className="mt-8 pt-6 border-t border-amber-500/10">
                            <h5 className="font-bold text-amber-300 text-lg mb-6">Program List & Registrations</h5>
                            <div className="space-y-8">
                              {['General', 'Super Senior', 'Senior', 'Sub Junior'].map(category => {
                                const categoryPrograms = programs.filter(p => p.category === category);"""

replacement = """                          {/* Registrations List Section */}
                          <div className="mt-8 pt-6 border-t border-amber-500/10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                              <h5 className="font-bold text-amber-300 text-lg">Program List & Registrations</h5>
                              <div className="relative w-full sm:w-64">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50" />
                                <input
                                  type="text"
                                  placeholder="Search by code or name..."
                                  value={programSearchQuery}
                                  onChange={(e) => setProgramSearchQuery(e.target.value)}
                                  className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-lg text-sm text-amber-100 placeholder-stone-600 outline-none transition-colors"
                                />
                              </div>
                            </div>
                            <div className="space-y-8">
                              {['General', 'Super Senior', 'Senior', 'Sub Junior'].map(category => {
                                const categoryPrograms = programs.filter(p => {
                                  if (p.category !== category) return false;
                                  if (!programSearchQuery.trim()) return true;
                                  const searchLower = programSearchQuery.toLowerCase();
                                  return (p.code?.toLowerCase() || '').includes(searchLower) || p.name.toLowerCase().includes(searchLower);
                                });"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
