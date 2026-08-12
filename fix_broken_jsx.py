import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Lines to remove:
# <button
# ...
# className="hidden"
# />
# </div>

target = re.compile(r'<button\s*type="button"\s*onClick=\{\(\) => \{\s*if \(excelFileInputRef\.current\) \{\s*excelFileInputRef\.current\.value = \'\';\s*excelFileInputRef\.current\.click\(\);\s*\}\s*\}\}\s*className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 transition-colors"\s*>\s*<Upload className="w-4 h-4" />\s*Upload Excel\s*</button>\s*<input\s*type="file"\s*ref=\{excelFileInputRef\}\s*accept="\.xlsx, \.xls"\s*onChange=\{\(e\) => \{\s*handleExcelImport\(e\);\s*setTimeout\(\(\) => setAdminTab\(\'student_list\'\), 500\);\s*\}\}\s*className="hidden"\s*/>\s*</div>', re.DOTALL)

content = target.sub('', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
