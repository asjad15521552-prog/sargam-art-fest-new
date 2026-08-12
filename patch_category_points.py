import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                                        if (s.programResults) {
                                          s.programResults.forEach(r => {
                                            if (r.programCategory === category) {
                                              const prog = programs.find(p => p.name === r.programName);
                                              if (prog && prog.isDashboardPublished) {
                                                catPts += r.points || 0;
                                              }
                                            }
                                          });
                                        }"""

replacement = """                                        if (s.programResults) {
                                          s.programResults.forEach(r => {
                                            const prog = programs.find(p => (r.programId ? p.id === r.programId : p.name === r.programName));
                                            if (prog && prog.category === category && prog.isDashboardPublished) {
                                              catPts += r.points || 0;
                                            }
                                          });
                                        }"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
