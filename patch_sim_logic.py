import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = "if (prog && (prog.isResultPublished || simPublishedIds.includes(prog.id))) {"
replacement = "if (prog && simPublishedIds.includes(prog.id)) {"

if target in content:
    content = content.replace(target, replacement)
    print("Replaced logic")
else:
    print("Not found logic")

with open('src/App.tsx', 'w') as f:
    f.write(content)
