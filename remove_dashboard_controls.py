import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(
    r'\{/\* Live Dashboard Publishing Controls \*/\}.*?\{/\* Top Standings \*/\}',
    re.DOTALL
)

new_content = pattern.sub('{/* Top Standings */}', content)

if new_content != content:
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully removed Live Dashboard controls from dashboard tab")
else:
    print("Could not find Live Dashboard controls to remove")

