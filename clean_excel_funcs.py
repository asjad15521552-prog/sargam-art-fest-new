import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# excelFileInputRef
content = re.sub(r'\s*const excelFileInputRef = useRef<HTMLInputElement>\(null\);', '', content)
# programExcelFileInputRef
content = re.sub(r'\s*const programExcelFileInputRef = useRef<HTMLInputElement>\(null\);', '', content)

# handleExcelImport
content = re.sub(r'\s*const handleExcelImport = \(event: React\.ChangeEvent<HTMLInputElement>\) => \{.*?\}\s*\}\s*\};\s*\}', '', content, flags=re.DOTALL)
# wait, dotall will be risky for big functions if we are not careful. Let's just comment it out or leave it there if it's too much risk, but wait, let's try finding the start and end by manual parsing or just keep the functions, it won't hurt. Since the button is gone, the feature is removed.
# But wait, it's safer to leave them or remove them using AST tools. I will just leave them there, or better, remove the `import * as XLSX from 'xlsx';` if they are the only ones using it. Let's check where XLSX is used.

