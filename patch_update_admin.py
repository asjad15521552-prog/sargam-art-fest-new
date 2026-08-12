import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """  const categoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, 'dashboard')
    })).sort((a, b) => b.total - a.total);"""
replacement1 = """  const categoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, 'admin')
    })).sort((a, b) => b.total - a.total);"""

target2 = """  const globalTopStudents = [...students]
    .filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General')
    .map(s => ({ ...s, points: calculateStudentPoints(s, 'dashboard') }))
    .filter(s => s.points > 0)"""
replacement2 = """  const globalTopStudents = [...students]
    .filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General')
    .map(s => ({ ...s, points: calculateStudentPoints(s, 'admin') }))
    .filter(s => s.points > 0)"""

target3 = """  const topStudentsByCategory = ['Sub Junior', 'Senior', 'Super Senior'].map(cat => {
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat as CategoryName],
      students: students
        .filter(s => s.category === cat)
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'dashboard') }))
        .filter(s => s.points > 0)"""
replacement3 = """  const topStudentsByCategory = ['Sub Junior', 'Senior', 'Super Senior'].map(cat => {
    return {
      category: cat,
      malayalam: CATEGORY_MALAYALAM[cat as CategoryName],
      students: students
        .filter(s => s.category === cat)
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'admin') }))
        .filter(s => s.points > 0)"""

target4 = """  const topStudentsByClass = distinctClasses.map(cls => {
    return {
      className: cls,
      students: students
        .filter(s => s.class === cls && !s.code.startsWith('TEAM-'))
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'dashboard') }))
        .filter(s => s.points > 0)"""
replacement4 = """  const topStudentsByClass = distinctClasses.map(cls => {
    return {
      className: cls,
      students: students
        .filter(s => s.class === cls && !s.code.startsWith('TEAM-'))
        .map(s => ({ ...s, points: calculateStudentPoints(s, 'admin') }))
        .filter(s => s.points > 0)"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Success 1")
else:
    print("Fail 1")

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Success 2")
else:
    print("Fail 2")

if target3 in content:
    content = content.replace(target3, replacement3)
    print("Success 3")
else:
    print("Fail 3")

if target4 in content:
    content = content.replace(target4, replacement4)
    print("Success 4")
else:
    print("Fail 4")

with open('src/App.tsx', 'w') as f:
    f.write(content)
