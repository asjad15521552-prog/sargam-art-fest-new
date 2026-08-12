with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# We know the duplicate starts at line 390. Let's delete from 390 until we see the end of the function (around 418).
# Actually, the duplicate is lines 390 to 418.
# Let's just use string replacement.

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
    
duplicate_str = """  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formEvent.trim()) {
      showToast('Please select a student and enter the Event Name!', 'error');
      return;
    }
    
    // Find the student
    const existingStudent = students.find(s => s.code.toUpperCase() === formCode.trim().toUpperCase());
    if (!existingStudent) {
      showToast('Student not found. Please add them in Student Details first.', 'error');
      return;
    }

    const updatedResult: StudentResult = {
      ...existingStudent,
      event: formEvent.trim(),
      rank: Number(formRank) || 0,
      grade: formGrade.trim().toUpperCase() || '',
      points: Number(formPoints) || 0
    };

    const updatedList = students.map(s => s.code.toUpperCase() === updatedResult.code ? updatedResult : s);
    saveAndSetStudents(updatedList);
    showToast('Result published successfully!', 'success');
    resetForm();
  };
"""

content = content.replace(duplicate_str, "", 1) # only replace the first occurrence of the duplicate (so it removes one, keeps one)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

