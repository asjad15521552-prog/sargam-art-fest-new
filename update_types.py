with open('src/types.ts', 'r', encoding='utf-8') as f:
    content = f.read()

program_type = """
export interface Program {
  id: string;
  name: string;
  type: 'Stage' | 'Non-Stage';
}
"""

if "export interface Program" not in content:
    content += program_type
    with open('src/types.ts', 'w', encoding='utf-8') as f:
        f.write(content)
