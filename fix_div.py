import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('                            </div>\n                          </div>\n                      )}', '                            </div>\n                          </div>\n                        </div>\n                      )}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
