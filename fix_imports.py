import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("  Edit,\n  Printer,\n  Eye,\n  EyeOff,\n  Calendar,\n  Clock,\n  CalendarDays,", "", 1)
content = content.replace("codeIdx", "idx")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
