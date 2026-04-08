from PIL import Image

def fix_background():
    img_path = r"C:\Users\bharg\OneDrive\Desktop\react_web\webfrontend\public\dental-logo.png"
    img = Image.open(img_path).convert("RGBA")
    
    datas = img.getdata()
    new_data = []
    
    # We want to replace anything near white with transparent
    for item in datas:
        # Check if the pixel is bright enough (basically the background)
        # item is (R, G, B, A)
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            # make it fully transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(img_path, "PNG")

if __name__ == "__main__":
    fix_background()
