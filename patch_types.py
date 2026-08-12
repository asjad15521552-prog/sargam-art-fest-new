import re
with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace("programName: string;", "programId?: string;\n    programName: string;")

with open('src/types.ts', 'w') as f:
    f.write(content)
