import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("opacity-0 group-hover:opacity-100", "")

with open('src/App.tsx', 'w') as f:
    f.write(content)
