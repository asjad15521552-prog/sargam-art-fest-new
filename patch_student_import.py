import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add ref
content = content.replace(
    "const programExcelFileInputRef = useRef<HTMLInputElement>(null);",
    "const programExcelFileInputRef = useRef<HTMLInputElement>(null);\n  const studentExcelFileInputRef = useRef<HTMLInputElement>(null);"
)

# Add function
func = """  const handleStudentExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        
        const newStudents: StudentResult[] = [];
        
        for (let i = 1; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || row.length === 0) continue;
          
          let rawCode = String(row[0] || '').trim().toUpperCase();
          let rawName = String(row[1] || '').trim();
          let rawClass = String(row[2] || '').trim();
          let rawTeam = String(row[3] || '').trim();
          
          if (!rawCode || !rawName) continue;
          
          let team: TeamName = 'Thawbaz';
          const teamLower = rawTeam.toLowerCase();
          if (teamLower.includes('thawbaz')) team = 'Thawbaz';
          else if (teamLower.includes('yaqooth')) team = 'Yaqooth';
          else if (teamLower.includes('marjan')) team = 'Marjan';
          else if (teamLower.includes('aqeeq')) team = 'Aqeeq';
          else if (teamLower.includes('fayrooz')) team = 'Fayrooz';
          
          let category: ProgramCategory = 'General';
          const classNum = parseInt(rawClass, 10);
          if (!isNaN(classNum)) {
            if (classNum >= 1 && classNum <= 3) {
              category = 'Sub Junior';
            } else if (classNum >= 4 && classNum <= 5) {
              category = 'Senior';
            } else if (classNum >= 6 && classNum <= 8) {
              category = 'Super Senior';
            }
          }
          
          newStudents.push({
            code: rawCode,
            name: rawName,
            team: team,
            category: category,
            class: rawClass || 'N/A',
            event: '',
            rank: 0,
            grade: '',
            points: 0,
            programResults: []
          });
        }
        
        let updatedList = [...students];
        let addedCount = 0;
        let skippedCount = 0;
        
        newStudents.forEach(newStud => {
          const exists = updatedList.find(s => s.code === newStud.code);
          if (!exists) {
            updatedList.push(newStud);
            addedCount++;
          } else {
            skippedCount++;
          }
        });
        
        if (addedCount > 0) {
            persistToFirestore({ students: updatedList });
            showToast(`Imported ${addedCount} students successfully.${skippedCount > 0 ? ` Skipped ${skippedCount} duplicates.` : ''}`, 'success');
        } else if (skippedCount > 0) {
            showToast(`No new students added. Skipped ${skippedCount} duplicates.`, 'error');
        } else {
            showToast(`No valid student data found in the Excel file.`, 'error');
        }
        
      } catch (err) {
        console.error("Error parsing excel:", err);
        showToast('Failed to parse Excel file. Ensure it is a valid .xlsx file.', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
    if (studentExcelFileInputRef.current) {
        studentExcelFileInputRef.current.value = '';
    }
  };

  // Add or update student
  const handleSaveStudent ="""

content = content.replace("  // Add or update student\n  const handleSaveStudent =", func)

with open('src/App.tsx', 'w') as f:
    f.write(content)
