import re

with open("src/App.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# List of exact replacements for UI text (preserving code identifiers)
replacements = [
    ("Program not found.", "Programme not found."),
    ("Please enter a valid Program Code or Name to schedule", "Please enter a valid Programme Code or Name to schedule"),
    ("Program schedule updated successfully!", "Programme schedule updated successfully!"),
    ("deleted along with registrations & results", "deleted along with registrations & results"), # Program "..." deleted along with registrations & results -> handled by regex below or string replace
    ("<span>Programs</span>", "<span>Programmes</span>"),
    ("<span>Program Schedule</span>", "<span>Programme Schedule</span>"),
    ("<span>Program Registration</span>", "<span>Programme Registration</span>"),
    ("label: 'Programs & Registrations'", "label: 'Programmes & Registrations'"),
    ("label: 'All Programs'", "label: 'All Programmes'"),
    ("Programs & Registrations", "Programmes & Registrations"),
    ("Manage programs, program limits, and register students.", "Manage programmes, programme limits, and register students."),
    ("per team per program (General category can be configured during program creation).", "per team per programme (General category can be configured during programme creation)."),
    ("Add New Program", "Add New Programme"),
    (">Program Code<", ">Programme Code<"),
    (">Program Name<", ">Programme Name<"),
    (">Program Type<", ">Programme Type<"),
    ("Add Program</button>", "Add Programme</button>"),
    ("Program List & Registrations", "Programme List & Registrations"),
    ("Programs</h4>", "Programmes</h4>"),
    ("title=\"Delete Program\"", "title=\"Delete Programme\""),
    ("No programs added yet. Use the form above to add programs.", "No programmes added yet. Use the form above to add programmes."),
    ("Program Scheduling", "Programme Scheduling"),
    ("Type Program Code or Name", "Type Programme Code or Name"),
    ("placeholder=\"Type Program Code (e.g. P001, P002) or Name...\"", "placeholder=\"Type Programme Code (e.g. P001, P002) or Name...\""),
    ("Program not found. Type a valid Program Code (e.g. P001, P002) or Name.", "Programme not found. Type a valid Programme Code (e.g. P001, P002) or Name."),
    ("Clear All Programs", "Clear All Programmes"),
    (">Program Code</th>", ">Programme Code</th>"),
    (">Program Name</th>", ">Programme Name</th>"),
    ("manage all programs that are currently published", "manage all programmes that are currently published"),
    ("No programs are currently published", "No programmes are currently published"),
    ("Published Programs (", "Published Programmes ("),
    ("No published programs", "No published programmes"),
    ("Printing Enabled Programs (", "Printing Enabled Programmes ("),
    ("No programs enabled for printing", "No programmes enabled for printing"),
    ("Select Program to Add:", "Select Programme to Add:"),
    ("-- Select a Program --", "-- Select a Programme --"),
    ("+ Add All Programs (", "+ Add All Programmes ("),
    ("title = `Program: ", "title = `Programme: "),
    ("No results found for this program.", "No results found for this programme."),
    ("Search Program Code / Name:", "Search Programme Code / Name:"),
    ("Type a program code or select a program above to view its Registration Paper & chess numbers.", "Type a programme code or select a programme above to view its Registration Paper & chess numbers."),
    ("Header with Program Code and Name", "Header with Programme Code and Name"),
    ("Program: <span className=\"font-extrabold\">", "Programme: <span className=\"font-extrabold\">"),
    ("All Programs Overview", "All Programmes Overview"),
    ("Programs & Results", "Programmes & Results"),
    ("No programs</span>", "No programmes</span>"),
    ("Search Results & Program Tables", "Search Results & Programme Tables"),
    ("Search student individual results or view full program result tables", "Search student individual results or view full programme result tables"),
    ("Program Result Table", "Programme Result Table"),
    ("Participated Programs (", "Participated Programmes ("),
    ("No programs registered yet", "No programmes registered yet"),
    ("VIEW MODE 2: PROGRAM RESULT TABLE VIEW", "VIEW MODE 2: PROGRAMME RESULT TABLE VIEW"),
    ("Program Table Results Area", "Programme Table Results Area"),
    ("// Show all published programs by default if no filter", "// Show all published programmes by default if no filter"),
    ("No programs found matching your search.", "No programmes found matching your search."),
    ("Are you sure you want to clear all programs and registrations?", "Are you sure you want to clear all programmes and registrations?"),
    ("Are you sure you want to clear all program results?", "Are you sure you want to clear all programme results?"),
    ("<h3>Program Registration</h3>", "<h3>Programme Registration</h3>"),
    (">Program Code</label>", ">Programme Code</label>"),
    ("showToast('Invalid Program Code', 'error');", "showToast('Invalid Programme Code', 'error');"),
    ("program.`, 'error');", "programme.`, 'error');"),
    ("General program limit", "General programme limit"),
    ("Registered Students for Program'", "Registered Students for Programme'"),
    ("Type a Program Code above to view registered students for that program.", "Type a Programme Code above to view registered students for that programme."),
    ("Program code \"", "Programme code \""),
    ("Program'}</span>", "Programme'}</span>"),
    ("Program Code (Topic Events)", "Programme Code (Topic Events)"),
    ("This program does not require topic registration.", "This programme does not require topic registration."),
    ("Unknown Program'}", "Unknown Programme'}"),
    ("<h3>Programs List</h3>", "<h3>Programmes List</h3>"),
    ("View and search through all registered programs.", "View and search through all registered programmes."),
    ("No programs found.", "No programmes found."),
    ("<h3>Program Schedule</h3>", "<h3>Programme Schedule</h3>"),
    ("No programs scheduled yet.", "No programmes scheduled yet."),
    ("No scheduled programs found matching your search.", "No scheduled programmes found matching your search."),
]

new_content = content

# Also update the deleted program toast: Program "${progToDelete.name}" deleted -> Programme "${progToDelete.name}" deleted
new_content = re.sub(r'Program "([^"]+)" deleted along with registrations', r'Programme "\1" deleted along with registrations', new_content)

for old_str, new_str in replacements:
    if old_str not in new_content:
        print(f"WARNING: String not found: {old_str}")
    new_content = new_content.replace(old_str, new_str)

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replacement complete.")
