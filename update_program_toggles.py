with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                                            <div className="flex items-center gap-2">
                                              <button"""

# Wait, let's just get the exact text of that section first
