import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """  const [confirmDeleteProgramId, setConfirmDeleteProgramId] = useState<string | null>(null);"""
replacement1 = """  const [confirmDeleteProgramId, setConfirmDeleteProgramId] = useState<string | null>(null);
  const [confirmSingleDeleteId, setConfirmSingleDeleteId] = useState<string | null>(null);"""

target2 = """  const handleDeleteSingleResult = (studentCode: string, programName: string) => {
    if (!window.confirm(`Are you sure you want to delete the result for ${programName}?`)) return;"""
replacement2 = """  const handleDeleteSingleResult = (studentCode: string, programName: string) => {
    const id = `${studentCode}_${programName}`;
    if (confirmSingleDeleteId !== id) {
      setConfirmSingleDeleteId(id);
      setTimeout(() => setConfirmSingleDeleteId(null), 3000);
      return;
    }
    setConfirmSingleDeleteId(null);"""

target3 = """                                                              <button 
                                                                onClick={() => handleDeleteSingleResult(s.code, eventName)}
                                                                className="p-1 hover:bg-rose-500/20 text-rose-500/50 hover:text-rose-400 rounded transition-colors flex items-center gap-1"
                                                                title="Delete this Result"
                                                              >
                                                                <Trash2 className="w-3 h-3" />
                                                              </button>"""
replacement3 = """                                                              <button 
                                                                onClick={() => handleDeleteSingleResult(s.code, eventName)}
                                                                className={`p-1 rounded transition-colors flex items-center gap-1 ${confirmSingleDeleteId === `${s.code}_${eventName}` ? 'bg-rose-500 text-white' : 'hover:bg-rose-500/20 text-rose-500/50 hover:text-rose-400'}`}
                                                                title={confirmSingleDeleteId === `${s.code}_${eventName}` ? "Click to Confirm" : "Delete this Result"}
                                                              >
                                                                <Trash2 className="w-3 h-3" />
                                                              </button>"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Success 1")
if target2 in content:
    content = content.replace(target2, replacement2)
    print("Success 2")
if target3 in content:
    content = content.replace(target3, replacement3)
    print("Success 3")

with open('src/App.tsx', 'w') as f:
    f.write(content)
