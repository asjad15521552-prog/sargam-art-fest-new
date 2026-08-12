import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('<div className="pt-4 border-t border-amber-500/10 space-y-4">\n                        </div>\n                      )}', '                      )}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
