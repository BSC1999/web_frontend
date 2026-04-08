import os
import glob
import re

directory = r'c:\Users\bharg\OneDrive\Desktop\react_web\webfrontend\src\pages'

def replacer(match):
    classes = match.group(1)
    # Check for mb- utility
    mb_match = re.search(r'\b(mb-\d+)\b', classes)
    mb_class = f" {mb_match.group(1)}" if mb_match else ""
    return f'<h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none{mb_class}">'

for file_path in glob.glob(os.path.join(directory, '*.jsx')):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(r'<h1 className="([^"]*)">', replacer, content)
        
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {os.path.basename(file_path)}')
