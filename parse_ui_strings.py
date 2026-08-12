import re

with open("src/App.tsx") as f:
    lines = f.readlines()

ui_matches = []

# Regex patterns for string literals and JSX children
# e.g., '...Program...', "...Program...", `...Program...`, or >...Program...<
for i, line in enumerate(lines, 1):
    # Check if line contains program case insensitively
    if re.search(r'program', line, re.IGNORECASE):
        # Let's extract strings or JSX content
        # If line has quotes or JSX tags with text
        # Ignore pure code comments or imports/type definitions if not user facing
        # But include Toasts, Labels, Headers, Options, Placeholders
        ui_matches.append((i, line.strip()))

print(f"Total matching lines: {len(ui_matches)}")
with open("ui_matches.txt", "w") as out:
    for num, line in ui_matches:
        out.write(f"{num}: {line}\n")

