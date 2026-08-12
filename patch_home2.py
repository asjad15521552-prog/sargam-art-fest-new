import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"          \{activeTab === 'top3' && \(\n            <div className=\"flex flex-col gap-10 w-full\">\n              <div>\n                <h3 className=\"text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2\">\n                  <Award className=\"w-5 h-5\" /> Overall Top Individuals\n                </h3>[\s\S]*?              <div>\n                <h3 className=\"text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2\">\n                  <Layers className=\"w-5 h-5\" /> Top Individuals By Category\n                </h3>"

new_block = """          {activeTab === 'top3' && (
            <div className="flex flex-col gap-10 w-full">
              <div>
                <h3 className="text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-5 h-5" /> Top Individuals By Category
                </h3>"""

content = re.sub(target, new_block, content)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed Overall Top Individuals from public home page part 2")
