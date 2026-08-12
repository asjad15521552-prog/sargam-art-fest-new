import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const programMap = new Map(programs.map(p => [p.id, p]));", "const programMap = new Map<string, Program>(programs.map(p => [p.id, p]));")

content = content.replace("const ProgramRegistrationForm = ({", "function ProgramRegistrationForm({")
content = content.replace("}) => {", "}) {")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
