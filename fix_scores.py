import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """  // --- SCORES AND STATS GENERATORS ---
  const getTeamScore = (team: TeamName): number => {
    return students
      .filter(s => s.team === team)
      .reduce((sum, s) => sum + (Number(s.points) || 0), 0);
  };

  const getCategoryRank = (team: TeamName, category: CategoryName): number => {
    return students
      .filter(s => s.team === team && s.category === category)
      .reduce((sum, s) => sum + (Number(s.points) || 0), 0);
  };"""
replacement = """  // --- SCORES AND STATS GENERATORS ---
  const calculateStudentPoints = (student: StudentResult, isPublic: boolean): number => {
    if (!student.programResults) return Number(student.points) || 0; // fallback
    if (!isPublic) {
      return student.programResults.reduce((sum, r) => sum + r.points, 0);
    }
    // Only count points for published programs
    const publishedProgramNames = new Set(programs.filter(p => p.isResultPublished).map(p => p.name));
    return student.programResults
      .filter(r => publishedProgramNames.has(r.programName))
      .reduce((sum, r) => sum + r.points, 0);
  };

  const getTeamScore = (team: TeamName, isPublic: boolean = false): number => {
    return students
      .filter(s => s.team === team)
      .reduce((sum, s) => sum + calculateStudentPoints(s, isPublic), 0);
  };

  const getCategoryRank = (team: TeamName, category: CategoryName, isPublic: boolean = false): number => {
    return students
      .filter(s => s.team === team && s.category === category)
      .reduce((sum, s) => sum + calculateStudentPoints(s, isPublic), 0);
  };"""

content = content.replace(target, replacement)

target2 = """  // 1. Team scoring totals ranked desc
  const teamScoringList = TEAMS.map(team => ({
    name: team,
    malayalam: TEAM_MALAYALAM[team],
    score: getTeamScore(team)
  })).sort((a, b) => b.score - a.score);

  // 2. Category rankings array
  const categoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat)
    })).sort((a, b) => b.total - a.total);"""

replacement2 = """  // 1. Team scoring totals ranked desc
  const teamScoringList = TEAMS.map(team => ({
    name: team,
    malayalam: TEAM_MALAYALAM[team],
    score: getTeamScore(team, true) // Public by default for homepage
  })).sort((a, b) => b.score - a.score);

  const adminTeamScoringList = TEAMS.map(team => ({
    name: team,
    malayalam: TEAM_MALAYALAM[team],
    score: getTeamScore(team, false) // Admin view sees all
  })).sort((a, b) => b.score - a.score);

  // 2. Category rankings array
  const categoryRankData = CATEGORIES.map(cat => {
    const ranking = TEAMS.map(team => ({
      team,
      malayalam: TEAM_MALAYALAM[team],
      total: getCategoryRank(team, cat, true)
    })).sort((a, b) => b.total - a.total);"""

content = content.replace(target2, replacement2)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Score calculation patched")
