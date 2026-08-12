with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Remove from Public Dashboard
public_start = content.find("          {activeTab === 'top3' && (\n            <div className=\"flex flex-col gap-10 w-full\">\n              <div>\n                <h3 className=\"text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2\">\n                  <Award className=\"w-5 h-5\" /> Overall Top Individuals")
public_end = content.find("              <div>\n                <h3 className=\"text-xl font-black text-amber-400 border-b border-amber-500/20 pb-3 mb-6 uppercase tracking-wider flex items-center gap-2\">\n                  <Layers className=\"w-5 h-5\" /> Top Individuals By Category")

if public_start != -1 and public_end != -1:
    content = content[:public_start] + "          {activeTab === 'top3' && (\n            <div className=\"flex flex-col gap-10 w-full\">\n" + content[public_end:]
    print("Fixed public dashboard.")
else:
    print("Could not find public dashboard block.")


with open('src/App.tsx', 'w') as f:
    f.write(content)
