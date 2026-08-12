import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = r'<h5 className="font-bold text-amber-400">Add New Program</h5>\s*</div>\s*<form onSubmit=\{handleAddProgram\} className="space-y-4">'

replacement = """<h5 className="font-bold text-amber-400">Add New Program</h5>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (programExcelFileInputRef.current) {
                                      programExcelFileInputRef.current.value = '';
                                      programExcelFileInputRef.current.click();
                                    }
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-500/20 transition-colors"
                                >
                                  <Upload className="w-3 h-3" />
                                  Bulk Import Excel
                                </button>
                                <input
                                   type="file"
                                   ref={programExcelFileInputRef}
                                  accept=".xlsx, .xls"
                                  onChange={handleProgramExcelImport}
                                  className="hidden"
                                />
                              </div>
                              <form onSubmit={handleAddProgram} className="space-y-4">"""

content = re.sub(target, replacement, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
