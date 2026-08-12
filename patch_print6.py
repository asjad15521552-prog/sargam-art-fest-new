import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r"""                                <button\n                                  onClick=\{\(\) => \{\n                                    const doc = new jsPDF\('portrait', 'mm', 'a4'\);\n                                    doc\.setFontSize\(18\);\n                                    doc\.text\(festivalName, 105, 15, \{ align: 'center' \}\);\n                                    doc\.setFontSize\(14\);\n                                    doc\.text\(`ARTS FESTIVAL COMPETITION RESULTS \$\{festivalYear\}`\, 105, 22, \{ align: 'center' \}\);\n                                    doc\.setFontSize\(12\);\n                                    doc\.text\('TEAM TOTAL POINTS \(LIVE\)', 105, 30, \{ align: 'center' \}\);\n                                    \n                                    const teamTotals = TEAMS\.map\(team => \{\n                                      const points = getTeamScore\(team, 'dashboard'\);\n                                      return \{ team, points \};\n                                    \}\)\.sort\(\(a, b\) => b\.points - a\.points\);\n                                    \n                                    const tableData = teamTotals\.map\(\(t, i\) => \[i \+ 1, t\.team, t\.points\]\);\n                                    \n                                    autoTable\(doc, \{\n                                      startY: 40,\n                                      head: \[\['Rank', 'Team Name', 'Total Points'\]\],\n                                      body: tableData,\n                                      theme: 'grid',\n                                      headStyles: \{ fillColor: \[79, 70, 229\], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 12, cellPadding: 6 \},\n                                      bodyStyles: \{ fontSize: 12, cellPadding: 6 \},\n                                      columnStyles: \{\n                                        0: \{ halign: 'center', cellWidth: 20 \},\n                                        1: \{ halign: 'left' \},\n                                        2: \{ halign: 'center', cellWidth: 40 \}\n                                      \},\n                                      margin: \{ left: 15, right: 15 \}\n                                    \}\);\n                                    \n                                    doc\.save\(`\$\{festivalName\}_TeamTotals\.pdf`\);\n                                  \}\}\n                                  className=\"bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2\"\n                                >\n                                  <Download className=\"w-4 h-4\" /> Team Totals\n                                </button>"""

replacement = """                                <button
                                  onClick={() => {
                                    // A4 landscape size: 297 x 210 mm (center is 148.5)
                                    const doc = new jsPDF('landscape', 'mm', 'a4');
                                    doc.setFontSize(36);
                                    doc.text(festivalName, 148.5, 30, { align: 'center' });
                                    doc.setFontSize(22);
                                    doc.text(`ARTS FESTIVAL COMPETITION RESULTS ${festivalYear}`, 148.5, 45, { align: 'center' });
                                    doc.setFontSize(26);
                                    doc.text('TEAM TOTAL POINTS', 148.5, 65, { align: 'center' });
                                    
                                    const teamTotals = TEAMS.map(team => {
                                      const points = getTeamScore(team, 'dashboard');
                                      return { team, points };
                                    }).sort((a, b) => b.points - a.points);
                                    
                                    const tableData = teamTotals.map((t, i) => [i + 1, t.team, t.points]);
                                    
                                    autoTable(doc, {
                                      startY: 85,
                                      head: [['Rank', 'Team Name', 'Total Points']],
                                      body: tableData,
                                      theme: 'grid',
                                      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 24, cellPadding: 14 },
                                      bodyStyles: { fontSize: 26, cellPadding: 16 },
                                      columnStyles: {
                                        0: { halign: 'center', cellWidth: 40 },
                                        1: { halign: 'left' },
                                        2: { halign: 'center', cellWidth: 50 }
                                      },
                                      margin: { left: 40, right: 40 }
                                    });
                                    
                                    doc.save(`${festivalName}_TeamTotals.pdf`);
                                  }}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2"
                                >
                                  <Download className="w-4 h-4" /> Team Totals
                                </button>"""

if re.search(target, content):
    content = re.sub(target, replacement, content)
    print("Match found and replaced!")
else:
    print("No match found for target string. Searching via string find...")
    # fallback
    start_str = "<Download className=\"w-4 h-4\" /> Download All as PDF"
    end_str = "<Download className=\"w-4 h-4\" /> Team Totals\n                                </button>"
    
    start_idx = content.find(start_str)
    if start_idx != -1:
        btn_idx = content.find("<button", start_idx)
        end_idx = content.find(end_str, start_idx) + len(end_str)
        
        # We need to be careful with fallback, let's just use exact replace if possible.
        print("Fallback!")
    else:
        print("Fallback also failed!")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
