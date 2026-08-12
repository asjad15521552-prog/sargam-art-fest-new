import re

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if 'const handleProgramExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {' in line:
        start_idx = i
        break

if start_idx != -1:
    open_brackets = 0
    for i in range(start_idx, len(lines)):
        open_brackets += lines[i].count('{')
        open_brackets -= lines[i].count('}')
        if open_brackets == 0:
            end_idx = i
            break

print("Start:", start_idx, "End:", end_idx)

if start_idx != -1 and end_idx != -1:
    new_func = """  const handleProgramExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Read everything as raw array of arrays
        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        const newPrograms: Program[] = [];
        
        for (let i = 1; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || row.length === 0) continue;
          
          let rawCode = String(row[0] || '').trim();
          let rawName = String(row[1] || '').trim();
          let rawType = String(row[2] || '').trim();
          let rawCategory = String(row[3] || '').trim();
          let rawTopic = String(row[4] || '').trim();
          let rawMaxPart = String(row[5] || '').trim();
          let rawMaxEntries = String(row[6] || '').trim();
          
          if (!rawName) continue;
          
          // Parse Category
          let category: ProgramCategory = 'General';
          const catLower = rawCategory.toLowerCase();
          if (catLower.includes('sub') || catLower.includes('junior')) category = 'Sub Junior';
          else if (catLower.includes('super')) category = 'Super Senior';
          else if (catLower.includes('senior')) category = 'Senior';
          
          // Parse Type
          let type: 'Stage' | 'Non-Stage' = 'Stage';
          if (rawType.toLowerCase().includes('non')) type = 'Non-Stage';
          
          // Topic registration (isSongEvent)
          let isSongEvent = false;
          if (rawTopic.includes('-')) isSongEvent = true;
          
          let maxParticipantsPerGroup: number | undefined = undefined;
          let maxEntriesPerTeam: number | undefined = undefined;
          
          if (category === 'General') {
             const parsedPart = parseInt(rawMaxPart, 10);
             if (!isNaN(parsedPart) && parsedPart > 0) maxParticipantsPerGroup = parsedPart;
             
             const parsedEnt = parseInt(rawMaxEntries, 10);
             if (!isNaN(parsedEnt) && parsedEnt > 0) maxEntriesPerTeam = parsedEnt;
          }
          
          newPrograms.push({
            id: Date.now().toString() + '-' + i,
            code: rawCode || undefined,
            name: rawName,
            type,
            category,
            isSongEvent,
            ...(maxParticipantsPerGroup !== undefined ? { maxParticipantsPerGroup } : {}),
            ...(maxEntriesPerTeam !== undefined ? { maxEntriesPerTeam } : {})
          });
        }
        
        if (newPrograms.length > 0) {
           let updatedPrograms = [...programs];
           newPrograms.forEach(np => {
              if (!updatedPrograms.some(p => p.name.toLowerCase() === np.name.toLowerCase() && p.category === np.category)) {
                 updatedPrograms.push(np);
              }
           });
           saveAndSetPrograms(updatedPrograms);
           showToast(`Successfully imported ${newPrograms.length} programs!`, 'success');
        } else {
           showToast('No valid programs found in the file.', 'error');
        }
      } catch (err) {
        console.error("Error parsing excel:", err);
        showToast('Failed to parse Excel file. Ensure it is a valid .xlsx file.', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
    if (programExcelFileInputRef.current) {
        programExcelFileInputRef.current.value = '';
    }
  };
"""
    lines = lines[:start_idx] + [new_func] + lines[end_idx+1:]
    with open('src/App.tsx', 'w') as f:
        f.writelines(lines)
