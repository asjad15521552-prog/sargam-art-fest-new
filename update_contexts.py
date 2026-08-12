import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change PublishContext
content = content.replace("type PublishContext = 'admin' | 'dashboard' | 'search';", "type PublishContext = 'admin' | 'dashboard' | 'public';")

# In calculateStudentPoints
content = content.replace("const publishedProgramNames = new Set(programs.filter(p => context === 'dashboard' ? p.isDashboardPublished : p.isResultPublished).map(p => p.name));", 
                          "const publishedProgramNames = new Set(programs.filter(p => context === 'dashboard' ? p.isDashboardPublished : (context === 'public' ? p.isResultPublished : true)).map(p => p.name));")

# Replace context in Search mapping
content = content.replace("calculateStudentPoints(student, 'search')", "calculateStudentPoints(student, 'public')")

# For Public tabs, we need them to use 'public' instead of 'dashboard'
# teamScoringList is used in BOTH public Total tab AND Admin Live Dashboard.
# We need to split them!
