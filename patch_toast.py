import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                                          showToast(prog.isResultPublished ? 'Unpublished from Public Dashboard' : 'Published to Public Dashboard', 'success');"""
replacement = """                                          showToast(prog.isResultPublished ? 'Unpublished' : 'Published', 'success');"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced toast logic")
else:
    print("Toast logic target not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
