import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """                                <th className="p-3 font-bold text-center">Dashboard Publish</th>"""
replacement1 = """                                <th className="p-3 font-bold text-center">Public Dashboard</th>"""

target2 = """                                        {prog.isDashboardPublished ? (
                                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/20">Published</span>
                                      ) : (
                                        <span className="bg-stone-800 text-stone-400 px-2 py-1 rounded text-[10px] font-bold border border-stone-700">Unpublished</span>
                                      )}"""
replacement2 = """                                        {prog.isDashboardPublished ? (
                                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/20">Published</span>
                                      ) : (
                                        <span className="bg-stone-800 text-stone-400 px-2 py-1 rounded text-[10px] font-bold border border-stone-700">Unpublished</span>
                                      )}"""

# Let's change the wording of the toast just in case.
target_toast = """                                          showToast(prog.isDashboardPublished ? 'Unpublished from Dashboard' : 'Published to Dashboard', 'success');"""
replacement_toast = """                                          showToast(prog.isDashboardPublished ? 'Unpublished from Public Dashboard' : 'Published to Public Dashboard', 'success');"""


if target1 in content:
    content = content.replace(target1, replacement1)
    print("Replaced target 1")
    
if target_toast in content:
    content = content.replace(target_toast, replacement_toast)
    print("Replaced target toast")

with open('src/App.tsx', 'w') as f:
    f.write(content)
