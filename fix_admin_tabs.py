import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                      {[
                        { id: 'student_details', label: 'Student Details' },
                        { id: 'result_publishing', label: 'Result Publishing' },
                        { id: 'program_details', label: 'Programs & Registrations' },
                        { id: 'settings', label: 'Settings' },
                        { id: 'student_list', label: 'All Students' }
                      ].map(tab => ("""

replacement = """                      {[
                        { id: 'dashboard', label: 'Live Dashboard' },
                        { id: 'student_details', label: 'Student Details' },
                        { id: 'result_publishing', label: 'Result Publishing' },
                        { id: 'program_details', label: 'Programs & Registrations' },
                        { id: 'settings', label: 'Settings' },
                        { id: 'student_list', label: 'All Students' }
                      ].map(tab => ("""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Admin tabs patched")
