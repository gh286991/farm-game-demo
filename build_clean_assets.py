import os
from PIL import Image

def make_transparent(img, bg_color_sample, tolerance=35):
  """Converts background green color of cropped image to transparent RGBA."""
  img = img.convert("RGBA")
  datas = img.getdata()

  r_target, g_target, b_target = bg_color_sample[:3]

  newData = []
  for item in datas:
    r, g, b, a = item
    # Calculate distance to background green color
    dist = Math_abs(r - r_target) + Math_abs(g - g_target) + Math_abs(b - b_target)
    if dist < tolerance:
      newData.append((255, 255, 255, 0)) # Fully transparent
    else:
      newData.append(item)

  img.putdata(newData)
  return img

def Math_abs(v):
  return abs(v)

def process_all():
  img_path = 'public/assets/farm_bg.jpg'
  if not os.path.exists(img_path):
    print("Master image not found!")
    return

  master = Image.open(img_path).convert("RGBA")
  w, h = master.size
  print(f"Master image size: {w}x{h}")

  out_dir = 'public/assets/sliced'
  os.makedirs(out_dir, exist_ok=True)

  # 1. Pure Grass Tile (Sample from top-left grass patch near x=80, y=80)
  grass = master.crop((60, 60, 124, 124))
  grass.save(os.path.join(out_dir, 'grass.png'))
  print("Saved clean grass.png")

  # 2. Pure Dry Soil Tile (Sample from middle of soil plot at x=450, y=280)
  soil_dry = master.crop((445, 280, 509, 344))
  soil_dry.save(os.path.join(out_dir, 'soil_dry.png'))
  print("Saved clean soil_dry.png")

  # 3. Pure Wet Soil Tile (Sample from middle of wet soil plot at x=710, y=410)
  soil_wet = master.crop((705, 410, 769, 474))
  soil_wet.save(os.path.join(out_dir, 'soil_wet.png'))
  print("Saved clean soil_wet.png")

  # 4. Cottage House (x=900, y=15, w=350, h=300)
  cottage = master.crop((910, 10, 1250, 310))
  # Crop out left green path overhang
  cottage_clean = master.crop((940, 10, 1250, 310))
  cottage_clean.save(os.path.join(out_dir, 'cottage.png'))
  print("Saved clean cottage.png")

  # 5. Tree with Transparent Background (Sample grass green at top corner of tree crop)
  tree_crop = master.crop((175, 305, 295, 445))
  # Sample background green from top left corner of tree crop
  bg_green = tree_crop.getpixel((5, 5))
  tree_transparent = make_transparent(tree_crop, bg_green, tolerance=45)
  tree_transparent.save(os.path.join(out_dir, 'tree_apple.png'))
  print("Saved transparent tree_apple.png")

  # 6. Shipping Bin
  bin_crop = master.crop((805, 192, 875, 262))
  bg_g = bin_crop.getpixel((2, 2))
  bin_trans = make_transparent(bin_crop, bg_g, tolerance=40)
  bin_trans.save(os.path.join(out_dir, 'shipping_bin.png'))
  print("Saved transparent shipping_bin.png")

  # 7. Water Well
  well_crop = master.crop((1195, 145, 1270, 240))
  bg_w = well_crop.getpixel((2, 2))
  well_trans = make_transparent(well_crop, bg_w, tolerance=40)
  well_trans.save(os.path.join(out_dir, 'water_well.png'))
  print("Saved transparent water_well.png")

  # 8. Scarecrow
  scarecrow_crop = master.crop((1045, 565, 1110, 650))
  bg_s = scarecrow_crop.getpixel((2, 2))
  scarecrow_trans = make_transparent(scarecrow_crop, bg_s, tolerance=40)
  scarecrow_trans.save(os.path.join(out_dir, 'scarecrow.png'))
  print("Saved transparent scarecrow.png")

  # 9. Flowers
  flowers_crop = master.crop((1085, 645, 1275, 745))
  bg_f = flowers_crop.getpixel((2, 2))
  flowers_trans = make_transparent(flowers_crop, bg_f, tolerance=35)
  flowers_trans.save(os.path.join(out_dir, 'flowers.png'))
  print("Saved transparent flowers.png")

if __name__ == '__main__':
  process_all()
