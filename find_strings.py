with open("src/App.tsx") as f:
    for i, line in enumerate(f, 1):
        line_str = line.strip()
        if "program" in line_str.lower():
            # filter lines that look like UI text (JSX, string literals, toasts, console, comments)
            print(f"{i}: {line_str}")
