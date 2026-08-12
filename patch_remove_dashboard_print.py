import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = "if (prog && prog.category === category && prog.isDashboardPublished) {"
replacement = "if (prog && prog.category === category && prog.isResultPublished) {"
content = content.replace(target, replacement)

target2 = "const isPublished = context === 'dashboard' ? prog.isDashboardPublished : prog.isResultPublished;"
replacement2 = "const isPublished = prog.isResultPublished;"
content = content.replace(target2, replacement2)

with open('src/App.tsx', 'w') as f:
    f.write(content)
