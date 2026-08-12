with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update globalTopStudents to 10
content = content.replace("  const globalTopStudents = [...students]\n    .filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General')\n    .map(s => ({ ...s, points: calculateStudentPoints(s, 'dashboard') }))\n    .filter(s => s.points > 0)\n    .sort((a, b) => b.points - a.points)\n    .slice(0, 5);",
                          "  const globalTopStudents = [...students]\n    .filter(s => !s.code.startsWith('TEAM-') && s.category !== 'General')\n    .map(s => ({ ...s, points: calculateStudentPoints(s, 'dashboard') }))\n    .filter(s => s.points > 0)\n    .sort((a, b) => b.points - a.points)\n    .slice(0, 10);")

target_print_start = "doc.text('CATEGORY-WISE TOP INDIVIDUALS (LIVE)', 105, 30, { align: 'center' });"
target_print_end = "<Download className=\"w-4 h-4\" /> Top Individuals\n                                </button>"

start_idx = content.find(target_print_start)
end_idx = content.find(target_print_end)

if start_idx != -1 and end_idx != -1:
    # We need to find the start of the `<button` block
    button_start_idx = content.rfind("<button", 0, start_idx)
    end_idx += len(target_print_end)
    
    new_print = """<button
                                  onClick={() => {
                                    const doc = new jsPDF('portrait', 'mm', 'a4');
                                    doc.setFontSize(18);
                                    doc.text(festivalName, 105, 15, { align: 'center' });
                                    doc.setFontSize(14);
                                    doc.text(`ARTS FESTIVAL COMPETITION RESULTS ${festivalYear}`, 105, 22, { align: 'center' });
                                    doc.setFontSize(12);
                                    doc.text('OVERALL TOP INDIVIDUALS (LIVE)', 105, 30, { align: 'center' });
                                    
                                    const tableData = globalTopStudents.map((s, i) => [i + 1, s.code, s.name, s.team, s.category, s.points]);
                                    
                                    autoTable(doc, {
                                      startY: 40,
                                      head: [['Rank', 'Code', 'Student Name', 'Team', 'Category', 'Points']],
                                      body: tableData,
                                      theme: 'grid',
                                      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 11, cellPadding: 4 },
                                      bodyStyles: { fontSize: 10, cellPadding: 4 },
                                      columnStyles: {
                                        0: { halign: 'center', cellWidth: 15 },
                                        1: { halign: 'center', cellWidth: 25 },
                                        2: { halign: 'left' },
                                        3: { halign: 'center', cellWidth: 35 },
                                        4: { halign: 'center', cellWidth: 30 },
                                        5: { halign: 'center', cellWidth: 20 }
                                      },
                                      margin: { left: 15, right: 15 }
                                    });
                                    
                                    doc.save(`${festivalName}_OverallTopIndividuals.pdf`);
                                  }}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" /> Overall Top Individuals
                                </button>
                                
                                <button
                                  onClick={() => {
                                    const doc = new jsPDF('portrait', 'mm', 'a4');
                                    doc.setFontSize(18);
                                    doc.text(festivalName, 105, 15, { align: 'center' });
                                    doc.setFontSize(14);
                                    doc.text(`ARTS FESTIVAL COMPETITION RESULTS ${festivalYear}`, 105, 22, { align: 'center' });
                                    doc.setFontSize(12);
                                    doc.text('CATEGORY-WISE TOP INDIVIDUALS (LIVE)', 105, 30, { align: 'center' });
                                    
                                    let currentY = 35;
                                    
                                    CATEGORIES.forEach(category => {
                                      const catStudents = students.map(s => {
                                        let catPts = 0;
                                        if (s.programResults) {
                                          s.programResults.forEach(r => {
                                            if (r.programCategory === category) {
                                              const prog = programs.find(p => p.name === r.programName);
                                              if (prog && prog.isDashboardPublished) {
                                                catPts += r.points || 0;
                                              }
                                            }
                                          });
                                        }
                                        return { studentCode: s.code, studentName: s.name, team: s.team, points: catPts };
                                      }).filter(s => s.points > 0).sort((a, b) => b.points - a.points);
                                      
                                      if (catStudents.length === 0) return;
                                      
                                      const tableData = catStudents.map((s, i) => [i + 1, s.studentCode, s.studentName, s.team, s.points]);
                                      
                                      doc.setFontSize(14);
                                      doc.setFont("helvetica", "bold");
                                      doc.text(`Category: ${category}`, 14, currentY + 5);
                                      
                                      autoTable(doc, {
                                        startY: currentY + 8,
                                        head: [['Rank', 'Code', 'Student Name', 'Team', 'Pts']],
                                        body: tableData,
                                        theme: 'grid',
                                        headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', halign: 'center', fontSize: 10, cellPadding: 3 },
                                        bodyStyles: { fontSize: 10, cellPadding: 3 },
                                        columnStyles: {
                                          0: { halign: 'center', cellWidth: 15 },
                                          1: { halign: 'center', cellWidth: 30 },
                                          2: { halign: 'left' },
                                          3: { halign: 'center', cellWidth: 40 },
                                          4: { halign: 'center', cellWidth: 20 }
                                        },
                                        margin: { bottom: 15 }
                                      });
                                      
                                      currentY = (doc as any).lastAutoTable.finalY + 10;
                                      
                                      if (currentY > 250) {
                                        doc.addPage();
                                        currentY = 20;
                                      }
                                    });
                                    
                                    doc.save(`${festivalName}_TopIndividualsByCategory.pdf`);
                                  }}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" /> Top Individuals By Category
                                </button>"""
                                
    content = content[:button_start_idx] + new_print + content[end_idx:]
    print("Updated print button logic using exact slice!")
else:
    print("Could not find print block.")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
