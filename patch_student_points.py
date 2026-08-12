import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """    const publishedProgramNames = new Set(programs.filter(p => context === 'dashboard' ? p.isDashboardPublished : p.isResultPublished).map(p => p.name));
    return student.programResults
      .filter(r => publishedProgramNames.has(r.programName))
      .reduce((sum, r) => sum + r.points, 0);"""

replacement = """    return student.programResults.reduce((sum, r) => {
      const prog = programs.find(p => (r.programId ? p.id === r.programId : p.name === r.programName));
      if (!prog) return sum;
      
      const isPublished = context === 'dashboard' ? prog.isDashboardPublished : prog.isResultPublished;
      if (isPublished) {
        return sum + r.points;
      }
      return sum;
    }, 0);"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
