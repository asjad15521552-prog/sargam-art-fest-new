import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """  const [adminTab, setAdminTab] = useState<'dashboard' | 'student_details' | 'result_publishing' | 'program_details' | 'settings' | 'student_list' | 'printing'>('dashboard');"""
replacement1 = """  const [adminTab, setAdminTab] = useState<'dashboard' | 'student_details' | 'result_publishing' | 'program_details' | 'settings' | 'student_list' | 'custom_tab' | 'printing'>('dashboard');"""

target2 = """                        { id: 'settings', label: 'Settings' },
                        { id: 'student_list', label: 'All Students' },
                        { id: 'printing', label: 'Printing' }
                      ].map(tab => ("""
replacement2 = """                        { id: 'settings', label: 'Settings' },
                        { id: 'student_list', label: 'All Students' },
                        { id: 'custom_tab', label: 'Custom Tab' },
                        { id: 'printing', label: 'Printing' }
                      ].map(tab => ("""

target3 = """                      {adminTab === 'student_list' && ("""
replacement3 = """                      {adminTab === 'custom_tab' && (
                        <div className="bg-stone-900 border border-amber-500/20 p-6 rounded-2xl space-y-4">
                          <h4 className="text-amber-300 font-bold mb-4">Custom Tab</h4>
                          <p className="text-amber-100/60 text-sm">Please let me know what content should go here.</p>
                        </div>
                      )}

                      {adminTab === 'student_list' && ("""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Success 1")
else:
    print("Fail 1")

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Success 2")
else:
    print("Fail 2")

if target3 in content:
    content = content.replace(target3, replacement3)
    print("Success 3")
else:
    print("Fail 3")

with open('src/App.tsx', 'w') as f:
    f.write(content)
