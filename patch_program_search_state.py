import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """  // --- NEW RESULT PUBLISHING STATE ---
  const [resultPublishProgramId, setResultPublishProgramId] = useState('');
  const [resultPublishSearchQuery, setResultPublishSearchQuery] = useState('');"""

replacement = """  // --- NEW RESULT PUBLISHING STATE ---
  const [resultPublishProgramId, setResultPublishProgramId] = useState('');
  const [resultPublishSearchQuery, setResultPublishSearchQuery] = useState('');
  const [programSearchQuery, setProgramSearchQuery] = useState('');"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
