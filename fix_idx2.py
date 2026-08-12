import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const idx = getIdx(['code', 'chest', 'id', 'admno']);", "const codeIdx = getIdx(['code', 'chest', 'id', 'admno']);")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
