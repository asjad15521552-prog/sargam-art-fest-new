import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldHeader = `<thead className="text-xs uppercase bg-stone-900 text-stone-400">
                                       <tr>
                                         <th className="px-4 py-3 rounded-tl-xl w-32">Program Code</th>
                                         <th className="px-4 py-3">Program Name</th>
                                         <th className="px-4 py-3">Team Points</th>
                                         <th className="px-4 py-3 rounded-tr-xl text-center w-28">Action</th>
                                       </tr>
                                     </thead>`;

const newHeader = `<thead className="text-xs uppercase bg-stone-900 text-stone-400">
                                       <tr>
                                         <th className="px-4 py-3 rounded-tl-xl w-32">Program Code</th>
                                         <th className="px-4 py-3">Program Name</th>
                                         <th className="px-4 py-3">Team Points</th>
                                         <th className="px-4 py-3 text-center w-28">Action</th>
                                         <th className="px-4 py-3 rounded-tr-xl text-center w-28">Printing</th>
                                       </tr>
                                     </thead>`;

if (!content.includes(oldHeader)) {
  console.error("oldHeader not found!");
  process.exit(1);
}

content = content.replace(oldHeader, newHeader);

const oldTd = `<td className="px-4 py-3 text-center">
                                              <button
                                                disabled={!selectedProg}
                                                onClick={() => {
                                                  if (selectedProg) {
                                                    const isSimPublished = simPublishedProgramIds.includes(selectedProg.id);
                                                    if (isSimPublished) {
                                                      setSimPublishedProgramIds(prev => prev.filter(id => id !== selectedProg.id));
                                                    } else {
                                                      setSimPublishedProgramIds(prev => [...prev, selectedProg.id]);
                                                    }
                                                  }
                                                }}
                                                className={\`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors w-full \${
                                                  !selectedProg 
                                                    ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                                                    : (selectedProg && simPublishedProgramIds.includes(selectedProg.id))
                                                    ? 'bg-amber-500 text-stone-950 hover:bg-amber-400' 
                                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                                }\`}
                                              >
                                                {(selectedProg && simPublishedProgramIds.includes(selectedProg.id)) ? 'Unpublish' : 'Publish'}
                                              </button>
                                            </td>`;

const newTd = `<td className="px-4 py-3 text-center">
                                              <button
                                                disabled={!selectedProg}
                                                onClick={() => {
                                                  if (selectedProg) {
                                                    const isSimPublished = simPublishedProgramIds.includes(selectedProg.id);
                                                    if (isSimPublished) {
                                                      setSimPublishedProgramIds(prev => prev.filter(id => id !== selectedProg.id));
                                                    } else {
                                                      setSimPublishedProgramIds(prev => [...prev, selectedProg.id]);
                                                    }
                                                  }
                                                }}
                                                className={\`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors w-full \${
                                                  !selectedProg 
                                                    ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                                                    : (selectedProg && simPublishedProgramIds.includes(selectedProg.id))
                                                    ? 'bg-amber-500 text-stone-950 hover:bg-amber-400' 
                                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                                }\`}
                                              >
                                                {(selectedProg && simPublishedProgramIds.includes(selectedProg.id)) ? 'Unpublish' : 'Publish'}
                                              </button>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                              <button
                                                disabled={!selectedProg}
                                                onClick={() => {
                                                  if (selectedProg) {
                                                    if (!printProgramIds.includes(selectedProg.id)) {
                                                      setPrintProgramIds(prev => [...prev, selectedProg.id]);
                                                    }
                                                    setAdminTab('printing');
                                                  }
                                                }}
                                                className={\`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors w-full flex items-center justify-center gap-1 \${
                                                  !selectedProg 
                                                    ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                                                    : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 cursor-pointer'
                                                }\`}
                                              >
                                                <Printer className="w-3.5 h-3.5" />
                                                <span>Printing</span>
                                              </button>
                                            </td>`;

if (!content.includes(oldTd)) {
  console.error("oldTd not found!");
  process.exit(1);
}

content = content.replace(oldTd, newTd);
fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('Update successful!');
