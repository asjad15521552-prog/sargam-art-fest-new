import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """  const [adminTab, setAdminTab] = useState<'dashboard' | 'student_details' | 'result_publishing' | 'program_details' | 'settings' | 'student_list'>('dashboard');
  const [dashboardViewMode, setDashboardViewMode] = useState<'admin' | 'public'>('admin');"""

replacement = """  const [adminTab, setAdminTab] = useState<'dashboard' | 'student_details' | 'result_publishing' | 'program_details' | 'settings' | 'student_list'>('dashboard');"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed dashboardViewMode state")
