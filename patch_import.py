import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = "Activity, FileText, Copy"
replacement = "Activity, FileText, Copy, List"

if target in content:
    content = content.replace(target, replacement)
    print("Success")
else:
    print("Failed")

with open('src/App.tsx', 'w') as f:
    f.write(content)
