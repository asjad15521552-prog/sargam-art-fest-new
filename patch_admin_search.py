import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target_state = """  const [adminTab, setAdminTab] = useState<'dashboard' | 'student_details' | 'result_publishing' | 'program_details' | 'settings' | 'student_list' | 'all_programs' | 'printing'>('dashboard');"""
replacement_state = """  const [adminTab, setAdminTab] = useState<'dashboard' | 'student_details' | 'result_publishing' | 'program_details' | 'settings' | 'student_list' | 'all_programs' | 'printing'>('dashboard');
  const [adminAllProgramsSearchQuery, setAdminAllProgramsSearchQuery] = useState('');"""

if target_state in content:
    content = content.replace(target_state, replacement_state)
    print("Added state successfully.")
else:
    print("Failed to add state.")

with open('src/App.tsx', 'w') as f:
    f.write(content)
