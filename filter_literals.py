import re

with open("src/App.tsx") as f:
    lines = f.readlines()

for i, line in enumerate(lines, 1):
    # match quotes or JSX text containing program/programs
    # excluding variable names like 'const programId' or 'programId:' or 'programs.map' unless inside a string/JSX
    m_string = re.findall(r'([\'"`>][^\'"\`<>]*program[^\'"\`<>]*[\'"\`<])', line, re.IGNORECASE)
    if m_string:
        print(f"{i}: {line.strip()}")
