import os
from PIL import Image

def slice_map():
  img_path = 'public/assets/farm_bg.jpg'
  if not os.path.exists(img_path):
    print("Master image not found!")
    return

  img = Image.open(img_path)
  w, h = img.size
  print(f"Master image loaded: {w}x{h}")

  out_dir = 'public/assets/sliced'
  os.makedirs(out_dir, exist_ok=True)

  # Crop regions (x1, y1, x2, y2)
  crops = {
    # Seamless Grass Tile
    'grass.png': (500, 500, 564, 564),
    # Dry Tilled Soil Plot
    'soil_dry.png': (415, 275, 479, 339),
    # Watered Wet Soil Plot
    'soil_wet.png': (690, 395, 754, 459),
    # Red-roofed Wooden Cottage
    'cottage.png': (900, 15, 1260, 320),
    # Apple Tree
    'tree_apple.png': (175, 305, 295, 445),
    # Wooden Shipping Bin
    'shipping_bin.png': (800, 190, 870, 260),
    # Water Well
    'water_well.png': (1190, 140, 1270, 240),
    # Scarecrow
    'scarecrow.png': (1040, 560, 1110, 650),
    # Flower Patch
    'flowers.png': (1080, 640, 1280, 750)
  }

  for name, bbox in crops.items():
    cropped = img.crop(bbox)
    save_path = os.path.join(out_dir, name)
    cropped.save(save_path)
    print(f"Saved sliced asset: {save_path} ({cropped.size})")

if __name__ == '__main__':
  slice_map()
