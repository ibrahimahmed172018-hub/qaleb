import os
from PIL import Image, ImageFilter

source_path = 'public/logo.png'
if not os.path.exists(source_path):
    # Try alternative locations
    alternatives = [
        'logo.png',
        '/home/ebrahim/.gemini/antigravity/brain/9f2712b2-529b-4f1d-8c12-9bd1118cae7c/.user_uploaded/media_1790746802961.png'
    ]
    for alt in alternatives:
        if os.path.exists(alt):
            source_path = alt
            break

print(f"Loading source logo from: {source_path}")
img = Image.open(source_path).convert('RGBA')
width, height = img.size

# Step 1: Crop out the text at the bottom, keep ONLY the top icon area
# In this logo, the mark ends around y = 158 and text 'QALEB' starts at y = 165
# Using min(int(height * 0.56), 160) reliably isolates the mark without any letters
crop_y_limit = min(int(height * 0.56), 160)
icon_box = (0, 0, width, crop_y_limit)
cropped = img.crop(icon_box)

# Step 2: Remove white / near-white background and drop shadows to transparent
pixels = cropped.load()
for y in range(cropped.height):
    for x in range(cropped.width):
        r, g, b, a = pixels[x, y]
        # Check if pixel is white, light off-white, or neutral drop shadow on white
        if r > 215 and g > 215 and b > 215:
            pixels[x, y] = (0, 0, 0, 0)
        elif r > 160 and g > 160 and b > 160 and max(abs(r - g), abs(g - b), abs(r - b)) < 25:
            pixels[x, y] = (0, 0, 0, 0)
        elif r > 180 and g > 180 and b > 180 and max(abs(r - g), abs(g - b), abs(r - b)) < 35:
            pixels[x, y] = (0, 0, 0, 0)

# Step 3: Auto-crop transparent boundaries to tightly frame the icon
bbox = cropped.getbbox()
if bbox:
    cropped = cropped.crop(bbox)
print(f"Cropped mark bounding box: {bbox}, size: {cropped.size}")

# Step 4: Make it a perfect 1:1 square with equal padding
w, h = cropped.size
max_dim = max(w, h)
padding = int(max_dim * 0.1) # 10% padding
square_size = max_dim + (padding * 2)

square_img = Image.new('RGBA', (square_size, square_size), (0, 0, 0, 0))
offset_x = (square_size - w) // 2
offset_y = (square_size - h) // 2
square_img.paste(cropped, (offset_x, offset_y), cropped)

# Step 5: High quality resizing with smooth alpha antialiasing
icon_512 = square_img.resize((512, 512), Image.Resampling.LANCZOS)
r, g, b, a = icon_512.split()
a_smooth = a.filter(ImageFilter.GaussianBlur(radius=0.6))
icon_512_smooth = Image.merge('RGBA', (r, g, b, a_smooth))

# Step 6: Save outputs
os.makedirs('src/app', exist_ok=True)
os.makedirs('public', exist_ok=True)

# 1. As Next.js automatic app icon (512x512)
icon_512_smooth.save('src/app/icon.png', 'PNG')
print("Saved src/app/icon.png (512x512)")

# 2. As classic favicon.ico in app directory and public directory
icon_64 = square_img.resize((64, 64), Image.Resampling.LANCZOS)
icon_64.save('src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
icon_64.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print("Saved src/app/favicon.ico and public/favicon.ico (Multi-size ICO)")

# 3. As standalone transparent mark in public
icon_512_smooth.save('public/icon.png', 'PNG')
print("Saved public/icon.png (512x512)")

print("Icon processed successfully with transparent background and square aspect ratio.")
