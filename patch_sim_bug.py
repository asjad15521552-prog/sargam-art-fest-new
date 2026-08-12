import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = "const prog = programs.find(p => p.id === r.programId || p.name === r.programName);"
replacement1 = "const prog = programs.find(p => (r.programId ? p.id === r.programId : p.name === r.programName));"

target2 = "if (r.programId === selectedProg.id || r.programName === selectedProg.name) {"
replacement2 = "if (r.programId ? r.programId === selectedProg.id : r.programName === selectedProg.name) {"

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Replaced 1")
else:
    print("Not found 1")

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced 2")
else:
    print("Not found 2")

with open('src/App.tsx', 'w') as f:
    f.write(content)
