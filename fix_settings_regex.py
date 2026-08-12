import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'(<Trash2 className="w-4 h-4 text-rose-400" />\s*<span>Clear All Programs</span>\s*</button>\s*</div>\s*</div>\s*)\)}',
    r'\1</div>\n                      )}',
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
