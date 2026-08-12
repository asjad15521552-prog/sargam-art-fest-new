with open("src/App.tsx", "r") as f:
    content = f.read()

import re

target = re.compile(
r"// 4 Categories arranged vertically.*?const verticalPositions = \[.*?\{ startX: 30, startY: 38 \},.*?\{ startX: 30, startY: 98 \},.*?\{ startX: 30, startY: 158 \},.*?\{ startX: 30, startY: 218 \}.*?\].*?CATEGORIES\.forEach\(\(category, index\) => \{.*?const teamPts = TEAMS\.map\(team => \{.*?const points = getCategoryRank\(team, category, 'dashboard'\);.*?return \{ team, points \};.*?\}\)\.sort\(\(a, b\) => b\.points - a\.points\);.*?const tableData = teamPts\.map\(\(t, i\) => \[i \+ 1, t\.team, t\.points\]\);.*?const pos = verticalPositions\[index\] \|\| \{ startX: 30, startY: 40 \+ index \* 60 \};.*?doc\.setFontSize\(14\);.*?doc\.setFont\(\"helvetica\", \"bold\"\);.*?doc\.text\(`Category: \$\{category\}`\, pos\.startX, pos\.startY \+ 5\);.*?autoTable\(doc, \{.*?startY: pos\.startY \+ 8,.*?head: \[\['Rank', 'Team Name', 'Points'\]\],.*?body: tableData,.*?theme: 'grid',.*?headStyles: \{ fillColor: \[79, 70, 229\], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 11, cellPadding: 3 \},.*?bodyStyles: \{ fontSize: 11, cellPadding: 3 \},.*?columnStyles: \{.*?0: \{ halign: 'center', cellWidth: 20 \},.*?1: \{ halign: 'left', cellWidth: 90 \},.*?2: \{ halign: 'center', cellWidth: 40 \}.*?\},.*?margin: \{ left: pos\.startX, bottom: 5 \}.*?\}\);.*?\}\);", re.DOTALL)

replacement = """// 4 Categories arranged in a 2x2 grid
                                    const gridPositions = [
                                      { startX: 15, startY: 40 },
                                      { startX: 115, startY: 40 },
                                      { startX: 15, startY: 130 },
                                      { startX: 115, startY: 130 }
                                    ];
                                      
                                    CATEGORIES.forEach((category, index) => {
                                      const teamPts = TEAMS.map(team => {
                                        const points = getCategoryRank(team, category, 'dashboard');
                                        return { team, points };
                                      }).sort((a, b) => b.points - a.points);
                                        
                                      const tableData = teamPts.map((t, i) => [i + 1, t.team, t.points]);
                                        
                                      const pos = gridPositions[index] || { startX: 15, startY: 40 + index * 60 };
                                      doc.setFontSize(12);
                                      doc.setFont("helvetica", "bold");
                                      doc.text(`Category: ${category}`, pos.startX, pos.startY + 5);
                                        
                                      autoTable(doc, {
                                        startY: pos.startY + 8,
                                        head: [['Rank', 'Team Name', 'Points']],
                                        body: tableData,
                                        theme: 'grid',
                                        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold', halign: 'center', fontSize: 10, cellPadding: 2 },
                                        bodyStyles: { fontSize: 10, cellPadding: 2 },
                                        columnStyles: {
                                          0: { halign: 'center', cellWidth: 15 },
                                          1: { halign: 'left', cellWidth: 45 },
                                          2: { halign: 'center', cellWidth: 20 }
                                        },
                                        margin: { left: pos.startX, bottom: 5 }
                                      });
                                    });"""

new_content = target.sub(replacement, content)
with open("src/App.tsx", "w") as f:
    f.write(new_content)
