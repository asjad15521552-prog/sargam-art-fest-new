import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """  const distinctClasses = Array.from(new Set(students.map(s => s.class).filter(c => c && c !== 'N/A' && c.trim() !== ''))).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB) && numA.toString() === a.trim() && numB.toString() === b.trim()) {
        return numA - numB;
    }
    return a.localeCompare(b);
  });"""

replacement1 = """  const distinctClasses = Array.from(new Set(students.map(s => s.class).filter(c => c && c !== 'N/A' && c.trim() !== '')) as Set<string>).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB) && numA.toString() === a.trim() && numB.toString() === b.trim()) {
        return numA - numB;
    }
    return a.localeCompare(b);
  });"""

target2 = """                                        });
                                        currentY = (doc as any).lastAutoTable.finalY + 5;"""
replacement2 = """                                        } as any);
                                        currentY = (doc as any).lastAutoTable.finalY + 5;"""

target3 = """                                  const pageCount = doc.internal.getNumberOfPages();"""
replacement3 = """                                  const pageCount = (doc.internal as any).getNumberOfPages();"""

target4 = """                                          margin: { left: 14, right: 14 },
                                          avoidPageSplit: true
                                        });"""
replacement4 = """                                          margin: { left: 14, right: 14 },
                                          pageBreak: 'avoid'
                                        });"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Success 1")

if target4 in content:
    content = content.replace(target4, replacement4)
    print("Success 4")

if target3 in content:
    content = content.replace(target3, replacement3)
    print("Success 3")


with open('src/App.tsx', 'w') as f:
    f.write(content)
