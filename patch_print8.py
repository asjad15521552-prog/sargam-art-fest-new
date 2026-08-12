import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""                                <button\n                                  onClick=\{\(\) => \{\n                                    const doc = new jsPDF\('portrait', 'mm', 'a4'\);\n                                    doc\.setFontSize\(18\);\n                                    doc\.text\(festivalName, 105, 15, \{ align: 'center' \}\);\n                                    doc\.setFontSize\(14\);\n                                    doc\.text\(`ARTS FESTIVAL COMPETITION RESULTS \$\{festivalYear\}`\, 105, 22, \{ align: 'center' \}\);\n                                    doc\.setFontSize\(12\);\n                                    doc\.text\('CATEGORY-WISE TEAM POINTS \(LIVE\)', 105, 30, \{ align: 'center' \}\);\n                                    \n                                    let currentY = 35;\n                                    \n                                    CATEGORIES\.forEach\(category => \{\n                                      const teamPts = TEAMS\.map\(team => \{\n                                        const points = getCategoryRank\(team, category, 'dashboard'\);\n                                        return \{ team, points \};\n                                      \}\)\.sort\(\(a, b\) => b\.points - a\.points\);\n                                      \n                                      const tableData = teamPts\.map\(\(t, i\) => \[i \+ 1, t\.team, t\.points\]\);\n                                      \n                                      doc\.setFontSize\(14\);\n                                      doc\.setFont\(\"helvetica\", \"bold\"\);\n                                      doc\.text\(`Category: \$\{category\}`\, 14, currentY \+ 5\);\n                                      \n                                      autoTable\(doc, \{\n                                        startY: currentY \+ 8,\n                                        head: \[\['Rank', 'Team Name', 'Points'\]\],\n                                        body: tableData,\n                                        theme: 'grid',\n                                        headStyles: \{ fillColor: \[240, 240, 240\], textColor: 0, fontStyle: 'bold', halign: 'center', fontSize: 12, cellPadding: 4 \},\n                                        bodyStyles: \{ fontSize: 12, cellPadding: 4 \},\n                                        columnStyles: \{\n                                          0: \{ halign: 'center', cellWidth: 30 \},\n                                          1: \{ halign: 'left' \},\n                                          2: \{ halign: 'center', cellWidth: 40 \}\n                                        \},\n                                        margin: \{ bottom: 15 \}\n                                      \}\);\n                                      \n                                      currentY = \(doc as any\)\.lastAutoTable\.finalY \+ 10;\n                                      \n                                      if \(currentY > 250\) \{\n                                        doc\.addPage\(\);\n                                        currentY = 20;\n                                      \}\n                                    \}\);\n                                    \n                                    doc\.save\(`\$\{festivalName\}_CategoryTeamPoints\.pdf`\);\n                                  \}\}\n                                  className=\"bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2\"\n                                >\n                                  <Download className=\"w-4 h-4\" /> Category Team Points\n                                </button>"""

replacement = """                                <button
                                  onClick={() => {
                                    // A4 landscape size: 297 x 210 mm
                                    const doc = new jsPDF('landscape', 'mm', 'a4');
                                    doc.setFontSize(24);
                                    doc.text(festivalName, 148.5, 18, { align: 'center' });
                                    doc.setFontSize(16);
                                    doc.text(`ARTS FESTIVAL COMPETITION RESULTS ${festivalYear}`, 148.5, 26, { align: 'center' });
                                    doc.setFontSize(18);
                                    doc.text('CATEGORY-WISE TEAM POINTS', 148.5, 36, { align: 'center' });
                                    
                                    // 4 Categories arranged in a 2x2 grid
                                    // Row 1: y = 45, Row 2: y = 120
                                    // Col 1: x = 20 (margin-left), Col 2: x = 155 (margin-left)
                                    const gridPositions = [
                                      { startX: 20, startY: 45 },
                                      { startX: 155, startY: 45 },
                                      { startX: 20, startY: 125 },
                                      { startX: 155, startY: 125 }
                                    ];
                                    
                                    CATEGORIES.forEach((category, index) => {
                                      const teamPts = TEAMS.map(team => {
                                        const points = getCategoryRank(team, category, 'dashboard');
                                        return { team, points };
                                      }).sort((a, b) => b.points - a.points);
                                      
                                      const tableData = teamPts.map((t, i) => [i + 1, t.team, t.points]);
                                      
                                      const pos = gridPositions[index];
                                      doc.setFontSize(14);
                                      doc.setFont("helvetica", "bold");
                                      doc.text(`Category: ${category}`, pos.startX, pos.startY + 5);
                                      
                                      autoTable(doc, {
                                        startY: pos.startY + 8,
                                        head: [['Rank', 'Team Name', 'Points']],
                                        body: tableData,
                                        theme: 'grid',
                                        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 11, cellPadding: 4 },
                                        bodyStyles: { fontSize: 11, cellPadding: 4 },
                                        columnStyles: {
                                          0: { halign: 'center', cellWidth: 20 },
                                          1: { halign: 'left', cellWidth: 60 },
                                          2: { halign: 'center', cellWidth: 35 }
                                        },
                                        margin: { left: pos.startX, bottom: 10 }
                                      });
                                    });
                                    
                                    doc.save(`${festivalName}_CategoryTeamPoints.pdf`);
                                  }}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" /> Category Team Points
                                </button>"""

if re.search(target, content):
    content = re.sub(target, replacement, content)
    print("Match found and replaced!")
else:
    print("No match found for target string. Searching via string find...")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
