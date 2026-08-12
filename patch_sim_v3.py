import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update state
target_state = """  // --- CHECK PUBLISH SIMULATOR STATE ---
  const [simRows, setSimRows] = useState<{id: string, programCode: string, selectedProgramId: string | null, isPublished: boolean}[]>(
    Array.from({length: 10}, (_, i) => ({
      id: `sim-${i}`,
      programCode: '',
      selectedProgramId: null,
      isPublished: false
    }))
  );"""

replacement_state = """  // --- CHECK PUBLISH SIMULATOR STATE ---
  const [simRows, setSimRows] = useState<{id: string, programCode: string, selectedProgramId: string | null}[]>(
    Array.from({length: 10}, (_, i) => ({
      id: `sim-${i}`,
      programCode: '',
      selectedProgramId: null
    }))
  );
  const [simPublishedProgramIds, setSimPublishedProgramIds] = useState<string[]>([]);"""

if target_state in content:
    content = content.replace(target_state, replacement_state)
    print("Replaced state")
else:
    print("Could not find state")


# 2. simPublishedIds in TEAMS.map
target_sim_ids = """const simPublishedIds = simRows.filter(r => r.isPublished && r.selectedProgramId).map(r => r.selectedProgramId);"""
replacement_sim_ids = """const simPublishedIds = simPublishedProgramIds;"""
if target_sim_ids in content:
    content = content.replace(target_sim_ids, replacement_sim_ids)
    print("Replaced simPublishedIds")
else:
    print("Could not find simPublishedIds")


# 3. onChange handler
target_onchange = """                                                onChange={(e) => {
                                                  const code = e.target.value.toUpperCase();
                                                  const matchedProg = programs.find(p => p.code?.toUpperCase() === code);
                                                  
                                                  setSimRows(prev => prev.map(r => {
                                                    if (r.id === row.id) {
                                                      return { 
                                                        ...r, 
                                                        programCode: code, 
                                                        selectedProgramId: matchedProg ? matchedProg.id : null,
                                                        isPublished: false
                                                      };
                                                    }
                                                    return r;
                                                  }));
                                                }}"""

replacement_onchange = """                                                onChange={(e) => {
                                                  const code = e.target.value.toUpperCase();
                                                  const matchedProg = programs.find(p => p.code?.toUpperCase() === code);
                                                  
                                                  setSimRows(prev => prev.map(r => 
                                                    r.id === row.id 
                                                      ? { ...r, programCode: code, selectedProgramId: matchedProg ? matchedProg.id : null }
                                                      : r
                                                  ));
                                                }}"""
if target_onchange in content:
    content = content.replace(target_onchange, replacement_onchange)
    print("Replaced onChange")
else:
    print("Could not find onChange")

# 4. the whole row block from `const teamPoints` to `</tr>`
# Let's use regex for safety
pattern_row = re.compile(r'const teamPoints.*?</tr>', re.DOTALL)
match = pattern_row.search(content)
if match:
    # Instead of replacing the whole row, let's just replace the button and the isSimPublished assignment
    
    pass

with open('src/App.tsx', 'w') as f:
    f.write(content)
