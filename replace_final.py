with open("src/App.tsx", "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    ('for this program yet', 'for this programme yet'),
    ('for program "', 'for programme "'),
    ('found for this program yet.', 'found for this programme yet.'),
    ('} Programs</span>', '} Programmes</span>'),
    ('} Programs\n', '} Programmes\n'),
    ('No programs scheduled on Stage 1 yet.', 'No programmes scheduled on Stage 1 yet.'),
    ('No programs scheduled on Stage 2 yet.', 'No programmes scheduled on Stage 2 yet.'),
    ('No Non-Stage programs scheduled yet.', 'No Non-Stage programmes scheduled yet.'),
]

for old_str, new_str in replacements:
    content = content.replace(old_str, new_str)

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Final replacements complete.")
