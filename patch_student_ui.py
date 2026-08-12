import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = r"""                          <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
                            <h4 className="text-sm font-bold text-amber-300">
                              \{editingCode \? 'Edit Student Details' : 'Add New Student'\}
                            </h4>
                            \{editingCode && \(
                              <button
                                type="button"
                                onClick=\{\(\) => \{
                                  handleDeleteStudent\(editingCode\);
                                  resetForm\(\);
                                \}\}
                                className="p-1\.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20 flex items-center"
                                title="Delete Student"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            \)\}
                          </div>"""

replacement = """                          <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
                            <h4 className="text-sm font-bold text-amber-300">
                              {editingCode ? 'Edit Student Details' : 'Add New Student'}
                            </h4>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (studentExcelFileInputRef.current) {
                                    studentExcelFileInputRef.current.value = '';
                                    studentExcelFileInputRef.current.click();
                                  }
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-500/20 transition-colors"
                              >
                                <Upload className="w-3 h-3" />
                                Bulk Import Excel
                              </button>
                              <input
                                 type="file"
                                 ref={studentExcelFileInputRef}
                                accept=".xlsx, .xls"
                                onChange={handleStudentExcelImport}
                                className="hidden"
                              />
                              {editingCode && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleDeleteStudent(editingCode);
                                    resetForm();
                                  }}
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20 flex items-center"
                                  title="Delete Student"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>"""

content = re.sub(target, replacement, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
