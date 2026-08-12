import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                      {adminTab === 'printing' && ("""
replacement = """                      {adminTab === 'check_publish' && (
                        <div className="bg-stone-900 border border-amber-500/20 p-6 rounded-2xl space-y-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-amber-500/10 pb-4 mb-4 gap-4">
                            <h4 className="text-xl font-bold flex items-center gap-2 text-amber-300">
                              <CheckCircle className="w-5 h-5" /> Check Publish
                            </h4>
                          </div>
                          <div className="text-stone-400">
                            Check Publish options will appear here.
                          </div>
                        </div>
                      )}
                      
                      {adminTab === 'printing' && ("""

if target in content:
    content = content.replace(target, replacement)
    print("replaced")
else:
    print("not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
