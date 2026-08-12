import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '<h4 className="font-bold text-amber-100">Live + Simulated Points</h4>'
replacement = '<h4 className="font-bold text-amber-100">Simulated Points</h4>'

if target in content:
    content = content.replace(target, replacement)
    print("Replaced label")
else:
    print("Not found label")

with open('src/App.tsx', 'w') as f:
    f.write(content)
