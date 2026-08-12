import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Pattern for student bulk import:
# <div className="bg-stone-900 border border-amber-500/20 p-5 rounded-2xl shadow-sm flex items-center justify-between">
# ...
# </div>
student_target = re.compile(r'<div className="bg-stone-900 border border-amber-500/20 p-5 rounded-2xl shadow-sm flex items-center justify-between">\s*<div>\s*<h4 className="text-sm font-bold text-amber-300">Bulk Import Students</h4>.*?</div>', re.DOTALL)
content = student_target.sub('', content)

# Pattern for program bulk import button and input:
program_target = re.compile(r'<button\s*type="button"\s*onClick=\{\(\) => \{\s*if \(programExcelFileInputRef\.current\) \{\s*programExcelFileInputRef\.current\.value = \'\';\s*programExcelFileInputRef\.current\.click\(\);\s*\}\s*\}\}\s*className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-\[11px\] font-bold rounded-lg border border-emerald-500/20 transition-colors"\s*>\s*<Upload className="w-3 h-3" />\s*Bulk Import Excel\s*</button>\s*<input\s*type="file"\s*ref=\{programExcelFileInputRef\}\s*accept="\.xlsx, \.xls"\s*onChange=\{handleProgramExcelImport\}\s*className="hidden"\s*/>', re.DOTALL)

content = program_target.sub('', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
