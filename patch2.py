import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """                    const studentRegs = registrations.filter(r => r.studentCode.toUpperCase() === student.code.toUpperCase());
                    const studentPrograms = studentRegs.map(reg => programs.find(p => p.id === reg.programId)).filter(Boolean) as Program[];
                    
                    return ("""

new_target1 = """                    const studentRegs = registrations.filter(r => r.studentCode.toUpperCase() === student.code.toUpperCase());
                    const registeredPrograms = studentRegs.map(reg => programs.find(p => p.id === reg.programId)).filter(Boolean) as Program[];
                    
                    const displayPrograms: { id: string, name: string, type: string, category: string, result: any, isRegistered: boolean }[] = [];
                    const seenNames = new Set<string>();

                    registeredPrograms.forEach(p => {
                      seenNames.add(p.name);
                      displayPrograms.push({
                        id: p.id,
                        name: p.name,
                        type: p.type,
                        category: p.category,
                        result: student.programResults?.find(r => r.programName === p.name),
                        isRegistered: true
                      });
                    });

                    (student.programResults || []).forEach(r => {
                      if (!seenNames.has(r.programName)) {
                        seenNames.add(r.programName);
                        const p = programs.find(prog => prog.name === r.programName);
                        displayPrograms.push({
                          id: p ? p.id : r.programName,
                          name: r.programName,
                          type: p ? p.type : 'Unknown',
                          category: p ? p.category : student.category,
                          result: r,
                          isRegistered: false
                        });
                      }
                    });

                    return ("""

target2 = """                        {/* Programs List */}
                        <div className="flex-1 md:border-l md:border-amber-500/10 md:pl-6">
                          <h5 className="text-sm font-bold text-amber-500/80 mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4" /> 
                            Participated Programs ({studentPrograms.length})
                          </h5>
                          {studentPrograms.length > 0 ? (
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                              {studentPrograms.map(prog => {
                                const progResult = student.programResults?.find(r => r.programName === prog.name);
                                return (
                                <div key={prog.id} className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 flex justify-between items-center">
                                  <div>
                                    <div className="text-sm font-bold text-amber-200">{prog.name}</div>
                                    <div className="text-[10px] text-stone-400">{prog.type} • {prog.category}</div>
                                  </div>
                                  {progResult ? ("""

new_target2 = """                        {/* Programs List */}
                        <div className="flex-1 md:border-l md:border-amber-500/10 md:pl-6">
                          <h5 className="text-sm font-bold text-amber-500/80 mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4" /> 
                            Participated Programs ({displayPrograms.length})
                          </h5>
                          {displayPrograms.length > 0 ? (
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                              {displayPrograms.map(prog => {
                                const progResult = prog.result;
                                return (
                                <div key={prog.id} className="bg-stone-900 p-2.5 rounded-lg border border-stone-800 flex justify-between items-center">
                                  <div>
                                    <div className="text-sm font-bold text-amber-200">{prog.name}</div>
                                    <div className="text-[10px] text-stone-400">{prog.type} • {prog.category}</div>
                                  </div>
                                  {progResult ? ("""

if target1 in content:
    content = content.replace(target1, new_target1)
    if target2 in content:
        content = content.replace(target2, new_target2)
        with open('src/App.tsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Both patched successfully")
    else:
        print("Target 2 not found")
else:
    print("Target 1 not found")
