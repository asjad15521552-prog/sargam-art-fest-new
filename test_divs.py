with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

# extract program_details block
start = content.find("{adminTab === 'program_details' && (")
end = content.find("{adminTab === 'settings' && (")
block = content[start:end]

open_divs = len(re.findall(r'<div\b[^>]*>', block))
close_divs = len(re.findall(r'</div>', block))

print(f"open: {open_divs}, close: {close_divs}")
