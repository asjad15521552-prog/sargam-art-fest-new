import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                            </div>
                          </div>
                        
                      )}"""

content = content.replace(target, """                            </div>
                          </div>
                        </div>
                      )}""")

with open('src/App.tsx', 'w') as f:
    f.write(content)
