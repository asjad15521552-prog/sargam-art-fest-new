import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """  // 2. Category rankings array
  const categoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, true)
    })).sort((a, b) => b.total - a.total);
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat],
      ranking
    };
  });

  // 3. Top 3 students globally
  const globalTopStudents = [...students]
    .filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General' && s.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 5); // display top 5 for better excitement, highlighting top 3 clearly"""

replacement = """  // 2. Category rankings array
  const categoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, true)
    })).sort((a, b) => b.total - a.total);
    return {
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

  // 3. Top 3 students globally
  const globalTopStudents = [...students]
    .filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General')
    .map(s => ({ ...s, points: calculateStudentPoints(s, true) }))
    .filter(s => s.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const adminTopPerformersList = [...students]
    .filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General')
    .map(s => ({ ...s, points: calculateStudentPoints(s, false) }))
    .filter(s => s.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Admin stats patched")
