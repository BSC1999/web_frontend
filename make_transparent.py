from PIL import Image

def make_transparent():
    img_path = r"C:\Users\bharg\OneDrive\Desktop\react_web\webfrontend\public\dental-logo.png"
    img = Image.open(img_path).convert("RGBA")
    
    datas = img.getdata()
    new_data = []
    
    # The current background is near #F4F8FB (244, 248, 251) or white
    for item in datas:
        # If the pixel is very light (background), make it transparent
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(img_path, "PNG")
    print("Image background made transparent.")

if __name__ == "__main__":
    make_transparent()
