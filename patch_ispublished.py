import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                                                        if (progId && publishedProgramIds.has(progId)) {
                                                          isPublished = true;
                                                        } else if (publishedProgramNames.has(eventName)) {
                                                          isPublished = true;
                                                        }"""

replacement = """                                                        if (progId) {
                                                          const p = programs.find(p => p.id === progId);
                                                          if (p?.isResultPublished) {
                                                            isPublished = true;
                                                          }
                                                        }
                                                        if (!isPublished) {
                                                          const p2 = programs.find(p => p.name === eventName && (p.category === s.category || p.category === 'General'));
                                                          if (p2?.isResultPublished) {
                                                            isPublished = true;
                                                          }
                                                        }"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Success patch_ispublished")
else:
    print("Target not found patch_ispublished")

