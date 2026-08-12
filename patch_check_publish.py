import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target_state = "const [adminTab, setAdminTab] = useState<'dashboard' | 'student_details' | 'result_publishing' | 'program_details' | 'settings' | 'student_list' | 'all_programs' | 'printing'>('dashboard');"
replacement_state = "const [adminTab, setAdminTab] = useState<'dashboard' | 'student_details' | 'result_publishing' | 'program_details' | 'settings' | 'student_list' | 'all_programs' | 'check_publish' | 'printing'>('dashboard');"

if target_state in content:
    content = content.replace(target_state, replacement_state)
    print("State replaced.")
else:
    print("State not found.")

target_tabs = """                      [
                        { id: 'dashboard', label: 'Dashboard' },
                        { id: 'student_details', label: 'Student Details' },
                        { id: 'result_publishing', label: 'Result Publishing' },
                        { id: 'program_details', label: 'Programs & Registrations' },
                        { id: 'settings', label: 'Settings' },
                        { id: 'student_list', label: 'All Students' },
                        { id: 'all_programs', label: 'All Programs' },
                        { id: 'printing', label: 'Printing' }
                      ].map(tab => ("""

replacement_tabs = """                      [
                        { id: 'dashboard', label: 'Dashboard' },
                        { id: 'student_details', label: 'Student Details' },
                        { id: 'result_publishing', label: 'Result Publishing' },
                        { id: 'program_details', label: 'Programs & Registrations' },
                        { id: 'settings', label: 'Settings' },
                        { id: 'student_list', label: 'All Students' },
                        { id: 'all_programs', label: 'All Programs' },
                        { id: 'check_publish', label: 'Check Publish' },
                        { id: 'printing', label: 'Printing' }
                      ].map(tab => ("""

if target_tabs in content:
    content = content.replace(target_tabs, replacement_tabs)
    print("Tabs replaced.")
else:
    print("Tabs not found.")

with open('src/App.tsx', 'w') as f:
    f.write(content)
