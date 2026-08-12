import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                                      {prog.isDashboardPublished ? (
                                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/20">Published in Public Dashboard</span>
                                      ) : (
                                        <span className="bg-stone-800 text-stone-400 px-2 py-1 rounded text-[10px] font-bold border border-stone-700">Unpublished in Public Dashboard</span>
                                      )}"""
replacement = """                                      {prog.isDashboardPublished ? (
                                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/20">Published</span>
                                      ) : (
                                        <span className="bg-stone-800 text-stone-400 px-2 py-1 rounded text-[10px] font-bold border border-stone-700">Unpublished</span>
                                      )}"""

if target in content:
    content = content.replace(target, replacement)
    print("Reverted status")
else:
    print("Status target not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
