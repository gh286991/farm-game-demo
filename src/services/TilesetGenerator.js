// Generates a modular 32x32 pixel-art Tileset Atlas for Phaser Tilemap
export function createModularTileset(scene) {
  const tileSize = 32;
  const cols = 8;
  const rows = 8;

  const canvas = document.createElement('canvas');
  canvas.width = tileSize * cols;
  canvas.height = tileSize * rows;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Tile Index Mapping (0 to 63)
  // Row 0: 0=Grass, 1=GrassFlowers, 2=DirtPath, 3=Cobblestone, 4=DrySoil, 5=WetSoil, 6=Water, 7=DeepWater
  // Row 1: 8=FenceH, 9=FenceV, 10=FenceCorner, 11=ShippingBin, 12=TreeTopLeft, 13=TreeTopRight, 14=TreeTrunk, 15=FlowerPatch
  // Row 2: 16=HouseRoofL, 17=HouseRoofM, 18=HouseRoofR, 19=HouseWallL, 20=HouseWallM, 21=HouseWallR, 22=HouseDoor, 23=HouseWindow
  // Row 3: 24=WaterEdgeN, 25=WaterEdgeS, 26=WaterEdgeW, 27=WaterEdgeE, 28=Scarecrow, 29=WaterWell, 30=WoodLogs, 31=Bridge

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const x = c * tileSize;
      const y = r * tileSize;

      ctx.save();
      ctx.translate(x, y);
      drawSingleTile(ctx, idx, tileSize);
      ctx.restore();
    }
  }

  // Add texture to Phaser
  scene.textures.addSpriteSheet('farm_tileset', canvas, {
    frameWidth: tileSize,
    frameHeight: tileSize
  });
}

function drawSingleTile(ctx, idx, s) {
  // Tile 0: Plain Grass
  if (idx === 0) {
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#43a047';
    ctx.fillRect(4, 4, 3, 3);
    ctx.fillRect(18, 20, 4, 2);
    ctx.fillRect(24, 8, 3, 3);
    ctx.fillStyle = '#66bb6a';
    ctx.fillRect(10, 12, 4, 3);
  }
  // Tile 1: Grass with Flowers
  else if (idx === 1) {
    drawSingleTile(ctx, 0, s); // Base grass
    ctx.fillStyle = '#ffeb3b';
    ctx.fillCircle ? ctx.fillCircle(10, 10, 3) : ctx.fillRect(8, 8, 4, 4);
    ctx.fillStyle = '#ff4081';
    ctx.fillRect(20, 20, 4, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(22, 8, 3, 3);
  }
  // Tile 2: Dirt Path
  else if (idx === 2) {
    ctx.fillStyle = '#d7ccc8';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#bcaaa4';
    ctx.fillRect(6, 8, 6, 4);
    ctx.fillRect(20, 18, 8, 5);
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(12, 24, 4, 3);
  }
  // Tile 3: Cobblestone Path
  else if (idx === 3) {
    ctx.fillStyle = '#78909c';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#90a4ae';
    ctx.fillRect(2, 2, 12, 12);
    ctx.fillRect(16, 2, 14, 12);
    ctx.fillRect(2, 16, 14, 14);
    ctx.fillRect(18, 16, 12, 14);
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(0, 0, s, 1);
    ctx.fillRect(0, 0, 1, s);
    ctx.fillRect(15, 0, 1, s);
    ctx.fillRect(0, 15, s, 1);
  }
  // Tile 4: Dry Tilled Soil
  else if (idx === 4) {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(2, 4, 28, 4);
    ctx.fillRect(2, 12, 28, 4);
    ctx.fillRect(2, 20, 28, 4);
    ctx.fillRect(2, 26, 28, 3);
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(4, 2, 6, 2);
    ctx.fillRect(18, 10, 8, 2);
  }
  // Tile 5: Wet Watered Soil
  else if (idx === 5) {
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#1f110b';
    ctx.fillRect(2, 4, 28, 4);
    ctx.fillRect(2, 12, 28, 4);
    ctx.fillRect(2, 20, 28, 4);
    ctx.fillRect(2, 26, 28, 3);
    ctx.fillStyle = '#29b6f6';
    ctx.fillRect(6, 6, 3, 3);
    ctx.fillRect(22, 14, 4, 3);
    ctx.fillRect(12, 22, 3, 3);
  }
  // Tile 6: Water Pond
  else if (idx === 6) {
    ctx.fillStyle = '#0288d1';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#03a9f4';
    ctx.fillRect(4, 8, 10, 4);
    ctx.fillRect(18, 20, 8, 3);
    ctx.fillStyle = '#81d4fa';
    ctx.fillRect(6, 9, 4, 2);
  }
  // Tile 7: Deep Water
  else if (idx === 7) {
    ctx.fillStyle = '#01579b';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#0288d1';
    ctx.fillRect(8, 12, 14, 5);
  }
  // Tile 8: Fence Horizontal
  else if (idx === 8) {
    drawSingleTile(ctx, 0, s);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(0, 10, s, 4);
    ctx.fillRect(0, 18, s, 4);
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(4, 6, 6, 20);
    ctx.fillRect(22, 6, 6, 20);
  }
  // Tile 9: Fence Vertical
  else if (idx === 9) {
    drawSingleTile(ctx, 0, s);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(10, 0, 4, s);
    ctx.fillRect(18, 0, 4, s);
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(6, 12, 20, 8);
  }
  // Tile 10: Fence Corner
  else if (idx === 10) {
    drawSingleTile(ctx, 0, s);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(10, 10, 22, 4);
    ctx.fillRect(10, 10, 4, 22);
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(8, 8, 8, 8);
  }
  // Tile 11: Shipping Bin Box
  else if (idx === 11) {
    drawSingleTile(ctx, 0, s);
    ctx.fillStyle = '#795548';
    ctx.fillRect(2, 4, 28, 24);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(2, 4, 28, 6); // Lid
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(13, 14, 6, 6); // Gold Lock
  }
  // Tile 12: Tree Top Left
  else if (idx === 12) {
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#388e3c';
    ctx.fillRect(4, 4, 24, 24);
  }
  // Tile 13: Tree Top Right
  else if (idx === 13) {
    ctx.fillStyle = '#1b5e20';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(4, 4, 24, 24);
  }
  // Tile 14: Tree Trunk
  else if (idx === 14) {
    drawSingleTile(ctx, 0, s);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(10, 0, 12, 26);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(10, 0, 3, 26);
  }
  // Tile 15: Flower Patch
  else if (idx === 15) {
    drawSingleTile(ctx, 0, s);
    const colors = ['#e91e63', '#9c27b0', '#ffeb3b', '#ff5722'];
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect((i * 9 + 4) % 26, (i * 7 + 6) % 26, 4, 4);
    }
  }
  // Tile 16: House Roof Left
  else if (idx === 16) {
    ctx.fillStyle = '#c62828';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(0, 0, 4, s);
  }
  // Tile 17: House Roof Middle
  else if (idx === 17) {
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(4, 4, 24, 6);
  }
  // Tile 18: House Roof Right
  else if (idx === 18) {
    ctx.fillStyle = '#c62828';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(28, 0, 4, s);
  }
  // Tile 19: House Wall Left
  else if (idx === 19) {
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(0, 0, 4, s);
  }
  // Tile 20: House Wall Middle
  else if (idx === 20) {
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(0, 15, s, 2);
  }
  // Tile 21: House Wall Right
  else if (idx === 21) {
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(28, 0, 4, s);
  }
  // Tile 22: House Door
  else if (idx === 22) {
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(4, 4, 24, 28);
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(6, 18, 3, 3);
  }
  // Tile 23: House Window
  else if (idx === 23) {
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(6, 6, 20, 18);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(15, 6, 2, 18);
    ctx.fillRect(6, 14, 20, 2);
  }
  // Tile 28: Scarecrow
  else if (idx === 28) {
    drawSingleTile(ctx, 0, s);
    ctx.fillStyle = '#795548';
    ctx.fillRect(14, 6, 4, 24);
    ctx.fillRect(4, 12, 24, 3);
    ctx.fillStyle = '#ffb300';
    ctx.fillCircle ? ctx.fillCircle(16, 8, 5) : ctx.fillRect(11, 3, 10, 10);
  }
  // Tile 29: Water Well
  else if (idx === 29) {
    drawSingleTile(ctx, 0, s);
    ctx.fillStyle = '#78909c';
    ctx.fillRect(4, 8, 24, 20);
    ctx.fillStyle = '#0288d1';
    ctx.fillRect(8, 12, 16, 12);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(2, 2, 28, 4);
  }
  // Default fallback grass
  else {
    drawSingleTile(ctx, 0, s);
  }
}
