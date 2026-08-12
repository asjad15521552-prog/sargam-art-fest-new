import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                      {[
                        { id: 'dashboard', label: 'Live Dashboard' },
                        { id: 'student_details', label: 'Student Details' },
                        { id: 'result_publishing', label: 'Result Publishing' },
                        { id: 'program_details', label: 'Programs & Registrations' },
                        { id: 'settings', label: 'Settings' },
                        { id: 'student_list', label: 'All Students' },
                        { id: 'all_programs', label: 'All Programs' },
                        { id: 'printing', label: 'Printing' }
                      ].map(tab => ("""
                      
replacement = """                      {[
                        { id: 'dashboard', label: 'Live Dashboard' },
                        { id: 'student_details', label: 'Student Details' },
                        { id: 'result_publishing', label: 'Result Publishing' },
                        { id: 'program_details', label: 'Programs & Registrations' },
                        { id: 'settings', label: 'Settings' },
                        { id: 'student_list', label: 'All Students' },
                        { id: 'all_programs', label: 'All Programs' },
                        { id: 'check_publish', label: 'Check Publish' },
                        { id: 'printing', label: 'Printing' }
                      ].map(tab => ("""

if target in content:
    content = content.replace(target, replacement)
    print("replaced")
else:
    print("not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
