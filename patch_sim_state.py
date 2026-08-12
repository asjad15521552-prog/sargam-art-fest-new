import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = "  // --- NEW RESULT PUBLISHING STATE ---"
replacement = """  // --- CHECK PUBLISH SIMULATOR STATE ---
  const [simRows, setSimRows] = useState<{id: string, programCode: string, selectedProgramId: string | null, isPublished: boolean}[]>(
    Array.from({length: 10}, (_, i) => ({
      id: `sim-${i}`,
      programCode: '',
      selectedProgramId: null,
      isPublished: false
    }))
  );

  // --- NEW RESULT PUBLISHING STATE ---"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced State")
else:
    print("Not found State")

with open('src/App.tsx', 'w') as f:
    f.write(content)
