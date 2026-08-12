import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove from frontend
target_public = """          {activeTab === 'program' && (
            <div className="w-full text-white">
              <h3 className="text-xl font-bold text-amber-400 mb-4">Program Registrations</h3>
              <p className="text-amber-500/70 text-sm mb-6">Manage student registrations for programs across all categories. Senior students can only participate in Senior and General categories, etc. A program allows maximum 10 participants (2 per team).</p>
              
              <div className="space-y-8">
                {['General', 'Super Senior', 'Senior', 'Sub Junior'].map(category => {
                  const categoryPrograms = programs.filter(p => p.category === category);
                  return (
                    <div key={category} className="bg-stone-900 border border-amber-500/20 rounded-2xl p-6">
                      <h4 className="text-lg font-black text-amber-300 mb-4 pb-2 border-b border-amber-500/20">{category} Programs</h4>
                      {categoryPrograms.length === 0 ? (
                        <div className="text-sm text-stone-500 text-center py-4">No programs in this category.</div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {categoryPrograms.map(prog => (
                            <div key={prog.id} className="bg-stone-950 border border-stone-800 rounded-xl p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h5 className="font-bold text-amber-100">{prog.name}</h5>
                                  <span className="text-[10px] uppercase font-bold text-amber-500/50">{prog.type} Event</span>
                                </div>
                                <span className="text-xs bg-stone-900 border border-stone-800 px-2 py-1 rounded text-stone-400">
                                  {registrations.filter(r => r.programId === prog.id).length}/10 Registered
                                </span>
                              </div>
                              <ProgramRegistrationForm 
                                program={prog} 
                                students={students} 
                                registrations={registrations} 
                                onRegister={(studentCode) => handleRegister(prog.id, studentCode, prog.type, prog.category)} 
                                onUnregister={(regId) => handleUnregister(regId)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}"""

content = content.replace(target_public, "")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
