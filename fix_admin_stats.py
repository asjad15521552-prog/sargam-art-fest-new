import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat],
      ranking
    };
  });

  // 3. Overall Top Performers (Individuals)
  const topPerformersList = students
    .filter(s => s.category !== 'General')
    .sort((a, b) => Number(b.points) - Number(a.points))
    .slice(0, 5);"""

replacement = """    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat],
      ranking
    };
  });

  const adminCategoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, false)
    })).sort((a, b) => b.total - a.total);
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat],
      ranking
    };
  });

  // 3. Overall Top Performers (Individuals)
  const topPerformersList = students
    .filter(s => s.category !== 'General')
    .map(s => ({ ...s, points: calculateStudentPoints(s, true) }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);
    
  const adminTopPerformersList = students
    .filter(s => s.category !== 'General')
    .map(s => ({ ...s, points: calculateStudentPoints(s, false) }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Admin stats patched")
