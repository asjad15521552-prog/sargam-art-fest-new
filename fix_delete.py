import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace handleDeleteStudent
old_delete = """  const handleDeleteStudent = (codeToDelete: string) => {
    if (confirm("Are you sure you want to completely remove this student's information?")) {
      const updated = students.filter(s => s.code.toUpperCase() !== codeToDelete.toUpperCase());
      saveAndSetStudents(updated);
      showToast('Information successfully removed.', 'success');
      if (editingCode === codeToDelete) {
        resetForm();
      }
    }
  };"""

new_delete = """  const handleDeleteStudent = (codeToDelete: string) => {
    const updated = students.filter(s => s.code.toUpperCase() !== codeToDelete.toUpperCase());
    saveAndSetStudents(updated);
    showToast('Information successfully removed.', 'success');
    if (editingCode === codeToDelete) {
      resetForm();
    }
  };"""

content = content.replace(old_delete, new_delete)

# Replace handleDeleteInlineStudent if it exists
old_inline_delete = """  const handleDeleteInlineStudent = (codeToDelete: string) => {
    if (confirm("Are you sure you want to remove this student?")) {
      const updated = inlineStudents.filter(s => s.code !== codeToDelete);
      setInlineStudents(updated);
      showToast('Student removed from list', 'success');
    }
  };"""

new_inline_delete = """  const handleDeleteInlineStudent = (codeToDelete: string) => {
    const updated = inlineStudents.filter(s => s.code !== codeToDelete);
    setInlineStudents(updated);
    showToast('Student removed from list', 'success');
  };"""
  
content = content.replace(old_inline_delete, new_inline_delete)

# Replace handleClearAll
old_clear = """  const handleClearAll = () => {
    if (confirm('WARNING: This will delete ALL students. This action cannot be undone. Are you sure?')) {
      if (confirm('Please confirm one more time. Delete ALL data?')) {
        saveAndSetStudents([]);
        resetForm();
        showToast('All student data has been completely erased.', 'success');
      }
    }
  };"""

new_clear = """  const handleClearAll = () => {
    saveAndSetStudents([]);
    resetForm();
    showToast('All student data has been completely erased.', 'success');
  };"""

content = content.replace(old_clear, new_clear)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
