with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

start = content.find("{adminTab === 'settings' && (")
end = content.find("{adminTab === 'student_list' && (")
block = content[start:end]

open_divs = len(re.findall(r'<div\b[^>]*>', block))
close_divs = len(re.findall(r'</div>', block))

print(f"open: {open_divs}, close: {close_divs}")
