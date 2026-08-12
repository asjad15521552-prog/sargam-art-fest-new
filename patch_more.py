import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Line 318
content = content.replace(
    "let res = s.programResults?.find(r => r.programName === selectedProgram.name);",
    "let res = s.programResults?.find(r => (r.programId ? r.programId === selectedProgram.id : r.programName === selectedProgram.name));"
)

# 2. Line 3095 & 3418
content = content.replace(
    "const res = student.programResults.find(r => r.programName === prog.name);",
    "const res = student.programResults.find(r => (r.programId ? r.programId === prog.id : r.programName === prog.name));"
)

# 3. Line 3572
# eventName here is either a name from registrations or programResults. It might be tricky, because eventName is a string.
# But wait, earlier in that block we map over `allEvents`. Let's look at that.

# 4. Line 4062
content = content.replace(
    "result: p.isResultPublished ? student.programResults?.find(r => r.programName === p.name) : undefined,",
    "result: p.isResultPublished ? student.programResults?.find(r => (r.programId ? r.programId === p.id : r.programName === p.name)) : undefined,"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
