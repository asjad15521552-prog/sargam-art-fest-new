import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("idx >= 0", "codeIdx >= 0")
content = content.replace("row[idx]", "row[codeIdx]")
content = content.replace("const nameIdx = getIdx(['name', 'program', 'event', 'competition']);", "const codeIdx = getIdx(['code']);\n        const nameIdx = getIdx(['name', 'program', 'event', 'competition']);")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
