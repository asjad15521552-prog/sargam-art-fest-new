import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                              return (
                                <>
                              TEAMS.map(team => {"""

replacement = """                              return (
                                <>
                              {TEAMS.map(team => {"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
