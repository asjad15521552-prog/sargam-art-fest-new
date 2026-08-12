import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"                                <button\n                                  onClick=\{\(\) => \{\n                                    const doc = new jsPDF\('portrait', 'mm', 'a4'\);\n                                    doc\.setFontSize\(18\);\n                                    doc\.text\(festivalName, 105, 15, \{ align: 'center' \}\);\n                                    doc\.setFontSize\(14\);\n                                    doc\.text\(`ARTS FESTIVAL COMPETITION RESULTS \$\{festivalYear\}`\, 105, 22, \{ align: 'center' \}\);\n                                    doc\.setFontSize\(12\);\n                                    doc\.text\('TOP 10 STUDENTS \(OVERALL - LIVE\)', 105, 30, \{ align: 'center' \}\);\n[\s\S]*?Top 10 Overall\n                                </button>"

new_block = ""

content = re.sub(target, new_block, content)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed Top 10 Overall from printing section")
