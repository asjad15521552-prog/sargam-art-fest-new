import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the line `const [editingCode, setEditingCode] = useState<string | null>(null);`
content = content.replace("  const [editingCode, setEditingCode] = useState<string | null>(null);\n", "")

# Insert it before the useEffect
target = "  const [resultPublishEntries, setResultPublishEntries] = useState<{id: string, code: string, rank: number, grade: string}[]>([\n    { id: 'initial', code: '', rank: 1, grade: 'A' }\n  ]);"

replacement = """  const [resultPublishEntries, setResultPublishEntries] = useState<{id: string, code: string, rank: number, grade: string}[]>([
    { id: 'initial', code: '', rank: 1, grade: 'A' }
  ]);
  
  const [editingCode, setEditingCode] = useState<string | null>(null);"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced")
else:
    print("Target not found")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

