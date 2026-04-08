import os
import glob

directory = r'c:\Users\bharg\OneDrive\Desktop\react_web\webfrontend\src\pages'

targets_replacements = [
    ('className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight uppercase leading-none"',
     'className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none"'),

    ('className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-none mb-3"',
     'className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3"'),
     
    ('className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight uppercase"',
     'className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase"'),
     
    ('className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight uppercase leading-none"',
     'className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none"')
]

for file_path in glob.glob(os.path.join(directory, '*.jsx')):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for target, replacement in targets_replacements:
        new_content = new_content.replace(target, replacement)
        
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {os.path.basename(file_path)}')
