from PIL import Image

def blend_background():
    img_path = r"C:\Users\bharg\OneDrive\Desktop\react_web\webfrontend\public\dental-logo.png"
    img = Image.open(img_path).convert("RGB")
    
    datas = img.getdata()
    new_data = []
    
    # Target background: #F4F8FB = (244, 248, 251)
    # White: (255, 255, 255)
    r_mult = 244 / 255.0
    g_mult = 248 / 255.0
    b_mult = 251 / 255.0
    
    for item in datas:
        # Multiply each pixel by the ratio so that white perfectly maps to #F4F8FB
        # Dark pixels are minimally affected, preserving anti-aliasing perfectly
        new_r = int(item[0] * r_mult)
        new_g = int(item[1] * g_mult)
        new_b = int(item[2] * b_mult)
        new_data.append((new_r, new_g, new_b))
            
    img.putdata(new_data)
    img.save(img_path, "PNG")

if __name__ == "__main__":
    blend_background()
