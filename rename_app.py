import os
import re

def replace_in_files():
    base_dir = r"c:\Users\bharg\OneDrive\Desktop\react_web\webfrontend\src"
    
    # Patterns to replace
    replacements = [
        (r"Clinical\s*<span([^>]+)>AI</span>", r"DENTA <span\1>AI</span>"),
        (r"Clinical AI", "DENTA AI"),
        (r"Clinical Dental AI", "DENTA AI"),
        (r"Clinical Dental", "DENTA"),
        (r"Clinical Engine", "DENTA Engine"),
        (r"Clinical Registry", "DENTA Registry"),
        (r"Clinical Diagnostic", "DENTA Diagnostic"),
        (r"Clinical Pathology", "DENTA Pathology"),
        (r"Clinical decision", "DENTA decision"),
        (r"Clinical Notes", "DENTA Notes"),
        (r"Clinical Editor", "DENTA Editor"),
        (r"Clinical Patient", "DENTA Patient"),
        (r"Clinical", "DENTA"),
    ]
    
    count = 0
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith((".jsx", ".js")):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                original = content
                for pattern, repl in replacements:
                    content = re.sub(pattern, repl, content, flags=re.IGNORECASE)
                
                if content != original:
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(content)
                    count += 1
    print(f"Updated {count} files.")

if __name__ == "__main__":
    replace_in_files()
