with open("src/App.tsx", "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    ("Select Program", "Select Programme"),
    ("No programs found", "No programmes found"),
    ("registered for this program!", "registered for this programme!"),
    ("Type a valid Program Code", "Type a valid Programme Code"),
    ("found for this program.", "found for this programme."),
    ("{/* Search Bar for Program Code / Name */}", "{/* Search Bar for Programme Code / Name */}"),
    ("Type Program Code (e.g. 101)", "Type Programme Code (e.g. 101)"),
    ("{pr?.name || 'Program'}", "{pr?.name || 'Programme'}"),
    ("Enter the Program Code, then enter Topic 1", "Enter the Programme Code, then enter Topic 1"),
]

for old_str, new_str in replacements:
    if old_str not in content:
        print(f"WARNING: String not found: {old_str}")
    content = content.replace(old_str, new_str)

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("More replacements complete.")
