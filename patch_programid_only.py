import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace find/some/filter conditions
patterns = [
    (r"r => \(r\.programId \? r\.programId === selectedProgram\.id : r\.programName === selectedProgram\.name\)", 
     r"r => r.programId === selectedProgram.id"),
    (r"r => \(r\.programId \? r\.programId !== selectedProgram\.id : r\.programName !== selectedProgram\.name\)", 
     r"r => r.programId !== selectedProgram.id"),
    (r"r => r\.programId \? r\.programId === prog\.id : r\.programName === prog\.name", 
     r"r => r.programId === prog.id"),
    (r"r => \(r\.programId \? r\.programId === prog\.id : r\.programName === prog\.name\)", 
     r"r => r.programId === prog.id"),
    (r"r => \(r\.programId \? r\.programId === p\.id : r\.programName === p\.name\)", 
     r"r => r.programId === p.id"),
    (r"r\.programId \? r\.programId === selectedProg\.id : r\.programName === selectedProg\.name", 
     r"r.programId === selectedProg.id"),
    (r"r\.programId \? p\.id === r\.programId : p\.name === r\.programName",
     r"p.id === r.programId")
]

for pat, repl in patterns:
    content = re.sub(pat, repl, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Replaced all fallback by name")
