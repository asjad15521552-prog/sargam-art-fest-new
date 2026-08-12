import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. In handlePublishResults
content = content.replace(
    """const newResult = {
        programName: selectedProgram.name,""",
    """const newResult = {
        programId: selectedProgram.id,
        programName: selectedProgram.name,"""
)
content = content.replace(
    "const filteredResults = existingResults.filter(r => r.programName !== selectedProgram.name);",
    "const filteredResults = existingResults.filter(r => (r.programId ? r.programId !== selectedProgram.id : r.programName !== selectedProgram.name));"
)
content = content.replace(
    "if (st.programResults?.some(r => r.programName === selectedProgram.name) && !processedCodes.has(st.code.toUpperCase())) {",
    "if (st.programResults?.some(r => (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name)) && !processedCodes.has(st.code.toUpperCase())) {"
)
content = content.replace(
    "const filtered = st.programResults.filter(r => r.programName !== selectedProgram.name);",
    "const filtered = st.programResults.filter(r => (r.programId ? r.programId !== selectedProgram.id : r.programName !== selectedProgram.name));"
)

# 2. In handleSaveResult
content = content.replace(
    "const existingIndex = existingResults.findIndex(r => r.programName === formEvent.trim());",
    "const selectedProgram = programs.find(p => p.name === formEvent.trim());\n    const existingIndex = existingResults.findIndex(r => (r.programId && selectedProgram ? r.programId === selectedProgram.id : r.programName === formEvent.trim()));"
)
# Wait, handleSaveResult doesn't easily have programId because it uses formEvent which is a string name.
# Let's fix handlePublishResults first, which is the main place.

with open('src/App.tsx', 'w') as f:
    f.write(content)
