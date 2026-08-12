with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I want to fix the extra </div> and the placement of the 'program' block.
# Let's just find the 'program' block and fix the nesting.

target = """          )}
        </div>

        {/* --- FOOTER STATEMENT --- */}"""

# Wait, the current content looks like:
#           )}
#         </div>
# 
#           {activeTab === 'program' && (
#              ...
#           )}
#         </div>
# 
#         {/* --- FOOTER STATEMENT --- */}

# Let's fix this exact string.

bad_content = """          )}
        </div>

          {activeTab === 'program' && ("""

good_content = """          )}

          {activeTab === 'program' && ("""

content = content.replace(bad_content, good_content)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
