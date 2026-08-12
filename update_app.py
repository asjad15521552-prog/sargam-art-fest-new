import re

with open("src/App.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update imports
old_import = "import { StudentResult, TeamName, CategoryName, TEAMS, CATEGORIES, TEAM_MALAYALAM, CATEGORY_MALAYALAM, Program, ProgramCategory } from './types';"
new_import = "import { StudentResult, TeamName, CategoryName, TEAMS, CATEGORIES, TEAM_CODES, TEAM_RANGES, TEAM_MALAYALAM, CATEGORY_MALAYALAM, Program, ProgramCategory, normalizeTeamName, getTeamFromChestNumber, getNextChestNumberForTeam } from './types';"

content = content.replace(old_import, new_import)

# 2. Update teamPasswords state
old_passwords = "'Thawbaz': '', 'Yaqooth': '', 'Marjan': '', 'Aqeeq': '', 'Fayrooz': ''"
new_passwords = "'Aqeeq': '', 'Tawbaz': '', 'Marjan': '', 'Fyruz': '', 'Yaqoot': ''"

content = content.replace(old_passwords, new_passwords)

# 3. Update formTeam default state and reset
content = content.replace("useState<TeamName>('Thawbaz');", "useState<TeamName>('Aqeeq');")
content = content.replace("setFormTeam('Thawbaz');", "setFormTeam('Aqeeq');")

# 4. Update student Excel import team logic
old_excel_team = """          let team: TeamName = 'Thawbaz';
          const teamLower = rawTeam.toLowerCase();
          if (teamLower.includes('thawbaz')) team = 'Thawbaz';
          else if (teamLower.includes('yaqooth')) team = 'Yaqooth';
          else if (teamLower.includes('marjan')) team = 'Marjan';
          else if (teamLower.includes('aqeeq')) team = 'Aqeeq';
          else if (teamLower.includes('fayrooz')) team = 'Fayrooz';"""

new_excel_team = """          let team: TeamName = normalizeTeamName(rawTeam);
          if (!rawTeam) {
            const inferred = getTeamFromChestNumber(rawCode);
            if (inferred) team = inferred;
          }"""

content = content.replace(old_excel_team, new_excel_team)

# 5. Update allowedTeams in result excel import
old_allowed = "const allowedTeams = ['Thawbaz', 'Yaqooth', 'Marjan', 'Aqeeq', 'Fayrooz'];"
new_allowed = "const allowedTeams = TEAMS;"

content = content.replace(old_allowed, new_allowed)

old_matched = "let matchedTeam = allowedTeams.find(t => t.toLowerCase() === rawTeam.trim().toLowerCase()) || rawTeam.trim();"
new_matched = """let matchedTeam = normalizeTeamName(rawTeam);
          if (!rawTeam) {
            const inferred = getTeamFromChestNumber(rawCode);
            if (inferred) matchedTeam = inferred;
          }"""

content = content.replace(old_matched, new_matched)

# 6. Update validTeams check in General program entry validation
old_valid_teams = "const validTeams = ['THAWBAZ', 'YAQOOTH', 'MARJAN', 'AQEEQ', 'FAYROOZ'];"
new_valid_teams = "const validTeams = ['AQEEQ', 'TAWBAZ', 'MARJAN', 'FYRUZ', 'YAQOOT', 'THAWBAZ', 'YAQOOTH', 'FAYROOZ', '100', '200', '300', '400', '500'];"

content = content.replace(old_valid_teams, new_valid_teams)

# 7. Update hardcoded team arrays in settings and registration selection
content = content.replace("['Thawbaz', 'Yaqooth', 'Marjan', 'Aqeeq', 'Fayrooz'].map", "TEAMS.map")

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated App.tsx successfully.")
