import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = "const isPublished = prog.isResultPublished;"
replacement1 = "const isPublished = context === 'dashboard' ? prog.isDashboardPublished : prog.isResultPublished;"
content = content.replace(target1, replacement1)

target2 = "if (prog && prog.category === category && prog.isResultPublished) {"
replacement2 = "if (prog && prog.category === category && prog.isDashboardPublished) {"
content = content.replace(target2, replacement2)

with open('src/App.tsx', 'w') as f:
    f.write(content)
