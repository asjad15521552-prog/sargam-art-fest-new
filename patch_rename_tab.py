import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """  const [adminTab, setAdminTab] = useState<'dashboard' | 'student_details' | 'result_publishing' | 'program_details' | 'settings' | 'student_list' | 'custom_tab' | 'printing'>('dashboard');"""
replacement1 = """  const [adminTab, setAdminTab] = useState<'dashboard' | 'student_details' | 'result_publishing' | 'program_details' | 'settings' | 'student_list' | 'all_programs' | 'printing'>('dashboard');"""

target2 = """                        { id: 'custom_tab', label: 'Custom Tab' },"""
replacement2 = """                        { id: 'all_programs', label: 'All Programs' },"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Success 1")
if target2 in content:
    content = content.replace(target2, replacement2)
    print("Success 2")

with open('src/App.tsx', 'w') as f:
    f.write(content)
