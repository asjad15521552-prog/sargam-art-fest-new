import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. teamScoringList -> add publicTeamScoringList
target1 = """  const adminTeamScoringList = TEAMS.map(team => ({
    name: team,
    malayalam: TEAM_MALAYALAM[team],
    score: getTeamScore(team, 'admin')
  })).sort((a, b) => b.score - a.score);"""

replacement1 = """  const adminTeamScoringList = TEAMS.map(team => ({
    name: team,
    malayalam: TEAM_MALAYALAM[team],
    score: getTeamScore(team, 'admin')
  })).sort((a, b) => b.score - a.score);

  const publicTeamScoringList = TEAMS.map(team => ({
    name: team,
    malayalam: TEAM_MALAYALAM[team],
    score: getTeamScore(team, 'public')
  })).sort((a, b) => b.score - a.score);"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Added publicTeamScoringList")
else:
    print("Failed to find target1")


# 2. categoryRankData -> add publicCategoryRankData
target2 = """  const categoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, 'dashboard')
    })).sort((a, b) => b.total - a.total);
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat],
      ranking
    };
  });"""

replacement2 = """  const categoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, 'dashboard')
    })).sort((a, b) => b.total - a.total);
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat],
      ranking
    };
  });

  const publicCategoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, 'public')
    })).sort((a, b) => b.total - a.total);
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat],
      ranking
    };
  });"""

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Added publicCategoryRankData")
else:
    print("Failed to find target2")

# 3. topStudentsByCategory -> we change it to 'public' because it's only on public tab? Let's verify.
# Wait, let's keep 'dashboard' in the existing ones and create 'public...' variants, just in case they are used in both.
target3 = """  const topStudentsByCategory = ['Sub Junior', 'Senior', 'Super Senior'].map(cat => {
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat as CategoryName],
      students: students
        .filter(s => s.category === cat)
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'dashboard') }))
        .filter(s => s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  });"""

replacement3 = """  const topStudentsByCategory = ['Sub Junior', 'Senior', 'Super Senior'].map(cat => {
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat as CategoryName],
      students: students
        .filter(s => s.category === cat)
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'dashboard') }))
        .filter(s => s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  });

  const publicTopStudentsByCategory = ['Sub Junior', 'Senior', 'Super Senior'].map(cat => {
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat as CategoryName],
      students: students
        .filter(s => s.category === cat)
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'public') }))
        .filter(s => s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  });"""

if target3 in content:
    content = content.replace(target3, replacement3)
    print("Added publicTopStudentsByCategory")
else:
    print("Failed to find target3")


target4 = """  const topStudentsByClass = distinctClasses.map(cls => {
    return {
      className: cls,
      students: students
        .filter(s => s.class === cls && !s.code.startsWith('TEAM-'))
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'dashboard') }))
        .filter(s => s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  }).filter(c => c.students.length > 0);"""

replacement4 = """  const topStudentsByClass = distinctClasses.map(cls => {
    return {
      className: cls,
      students: students
        .filter(s => s.class === cls && !s.code.startsWith('TEAM-'))
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'dashboard') }))
        .filter(s => s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  }).filter(c => c.students.length > 0);

  const publicTopStudentsByClass = distinctClasses.map(cls => {
    return {
      className: cls,
      students: students
        .filter(s => s.class === cls && !s.code.startsWith('TEAM-'))
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'public') }))
        .filter(s => s.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3)
    };
  }).filter(c => c.students.length > 0);"""

if target4 in content:
    content = content.replace(target4, replacement4)
    print("Added publicTopStudentsByClass")
else:
    print("Failed to find target4")


with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
