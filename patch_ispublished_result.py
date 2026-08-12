import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                                                              isPublished ? (
                                                                <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-rose-500/20">Nil</span>
                                                              ) : (
                                                                <span className="bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-stone-700">Registered</span>
                                                              )"""

replacement = """                                                              isPublished ? (
                                                                <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-rose-500/20">Nil</span>
                                                              ) : (
                                                                <span className="bg-stone-800 text-stone-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-stone-700">Registered</span>
                                                              )"""

# we already did this in our minds, let's make it actually look at whether we need to change it
# Wait, the user is saying: "When result is published, then deleted, the edit option and delete option should be shown there like before."
# Actually, the user says "എല്ലാ മത്സരാർത്ഥികളുടെയും രജിസ്റ്റർ ചെയ്തവരുടെയും ചെയ്യാത്തവരുടെയും എല്ലാം ഭാവിയിൽ വരാൻ സാധ്യതയുള്ള എഡിറ്റിംഗ് ഓപ്ഷൻ നിൽക്കുമ്പോൾ പബ്ലിഷിംഗ് എന്ന ഭാഗത്ത് ഡിലീറ്റ് ഓപ്ഷൻ ആ പരിപാടി ഡിലീറ്റ് ആയി അവിടെ എന്ന മുൻപത്തെപ്പോലെ തന്നെ കാണിക്കുന്ന ഓപ്ഷൻ എല്ലാത്തിലും നൽകണം"
# (Translation: "Even when result publishing is deleted, for all competitors (registered and unregistered) with the potential editing option standing, in the publishing section, the delete option... that program is deleted there... should be shown like before for all.")
print("Nothing to change here, looking at the admin panel program delete instead")
