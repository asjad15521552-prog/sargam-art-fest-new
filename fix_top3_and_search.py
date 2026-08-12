import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """  const topStudentsByCategory = ['Sub Junior', 'Senior', 'Super Senior'].map(cat => {
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat as CategoryName],
      students: [...students]
        .filter(s => s.category === cat && s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  });"""
replacement1 = """  const topStudentsByCategory = ['Sub Junior', 'Senior', 'Super Senior'].map(cat => {
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat as CategoryName],
      students: students
        .filter(s => s.category === cat)
        .map(s => ({ ...s, points: calculateStudentPoints(s, true) }))
        .filter(s => s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  });"""
content = content.replace(target1, replacement1)

target2 = """                      displayPrograms.push({
                        id: p.id,
                        code: p.code,
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
                          code: p ? p.code : undefined,
                          name: r.programName,
                          type: p ? p.type : 'Unknown',
                          category: p ? p.category : student.category,
                          result: r,
                          isRegistered: false
                        });
                      }
                    });"""

replacement2 = """                      displayPrograms.push({
                        id: p.id,
                        code: p.code,
                        name: p.name,
                        type: p.type,
                        category: p.category,
                        result: p.isResultPublished ? student.programResults?.find(r => r.programName === p.name) : undefined,
                        isRegistered: true
                      });
                    });
                    (student.programResults || []).forEach(r => {
                      if (!seenNames.has(r.programName)) {
                        seenNames.add(r.programName);
                        const p = programs.find(prog => prog.name === r.programName);
                        if (!p || p.isResultPublished) {
                          displayPrograms.push({
                            id: p ? p.id : r.programName,
                            code: p ? p.code : undefined,
                            name: r.programName,
                            type: p ? p.type : 'Unknown',
                            category: p ? p.category : student.category,
                            result: r,
                            isRegistered: false
                          });
                        }
                      }
                    });"""
content = content.replace(target2, replacement2)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Public view search patched")
