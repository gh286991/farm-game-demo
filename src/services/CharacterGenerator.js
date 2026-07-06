// Generates a 4-direction pixel-art farmer sprite sheet for Phaser
export function createFarmerTexture(scene) {
  const frameW = 48;
  const frameH = 48;
  const cols = 4;
  const rows = 4;

  const canvas = document.createElement('canvas');
  canvas.width = frameW * cols;
  canvas.height = frameH * rows;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Directions: Row 0 = Down, Row 1 = Up, Row 2 = Left, Row 3 = Right
  // Frames in each row: 0 = Idle, 1 = Walk Step 1, 2 = Walk Step 2, 3 = Tool Use Action
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * frameW;
      const y = row * frameH;

      ctx.save();
      ctx.translate(x, y);

      drawFarmerFrame(ctx, row, col, frameW, frameH);

      ctx.restore();
    }
  }

  // Create texture in Phaser
  scene.textures.addSpriteSheet('hero_spritesheet', canvas, {
    frameWidth: frameW,
    frameHeight: frameH
  });
}

function drawFarmerFrame(ctx, dir, step, w, h) {
  // dir: 0=Down, 1=Up, 2=Left, 3=Right
  // step: 0=Idle, 1=Walk1, 2=Walk2, 3=Action
  const cx = w / 2;
  const cy = h / 2 + 2;

  // Bobbing / Leg offset
  let legOffset1 = 0;
  let legOffset2 = 0;
  let headBob = 0;
  let armSwing1 = 0;
  let armSwing2 = 0;

  if (step === 1) {
    legOffset1 = -3;
    legOffset2 = 3;
    headBob = -1;
    armSwing1 = 4;
    armSwing2 = -4;
  } else if (step === 2) {
    legOffset1 = 3;
    legOffset2 = -3;
    headBob = -1;
    armSwing1 = -4;
    armSwing2 = 4;
  } else if (step === 3) {
    headBob = 2; // Action crouch/swing
  }

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 18, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // COLORS
  const hatColor = '#d9a05b';
  const hatRibbon = '#c0392b';
  const shirtColor = '#e74c3c';
  const overallColor = '#2980b9';
  const overallDark = '#1f618d';
  const skinColor = '#ffdbac';
  const bootColor = '#5d4037';
  const hairColor = '#6d4c41';

  // BACK VIEW (dir === 1)
  if (dir === 1) {
    // Boots
    ctx.fillStyle = bootColor;
    ctx.fillRect(cx - 7, cy + 12 + legOffset1, 5, 6);
    ctx.fillRect(cx + 2, cy + 12 + legOffset2, 5, 6);

    // Overalls / Pants
    ctx.fillStyle = overallColor;
    ctx.fillRect(cx - 8, cy + 2, 16, 12);

    // Red Shirt Back
    ctx.fillStyle = shirtColor;
    ctx.fillRect(cx - 7, cy - 6, 14, 9);

    // Head / Hair Back
    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.arc(cx, cy - 10 + headBob, 8, 0, Math.PI * 2);
    ctx.fill();

    // Straw Hat Back
    ctx.fillStyle = hatColor;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 11 + headBob, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hatRibbon;
    ctx.fillRect(cx - 10, cy - 14 + headBob, 20, 3);
    ctx.fillStyle = hatColor;
    ctx.beginPath();
    ctx.arc(cx, cy - 14 + headBob, 8, Math.PI, 0);
    ctx.fill();

    // Tool overhead if action
    if (step === 3) {
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(cx - 2, cy - 26, 4, 14);
    }
    return;
  }

  // LEFT / RIGHT VIEW (dir === 2 or 3)
  if (dir === 2 || dir === 3) {
    const flip = dir === 2 ? -1 : 1;
    ctx.save();
    ctx.scale(flip, 1);
    const fx = flip * cx;

    // Boots
    ctx.fillStyle = bootColor;
    ctx.fillRect(fx - 4 + legOffset1, cy + 12, 6, 6);
    ctx.fillRect(fx - 2 + legOffset2, cy + 12, 6, 6);

    // Overalls Side
    ctx.fillStyle = overallColor;
    ctx.fillRect(fx - 6, cy + 1, 12, 13);

    // Red Shirt Side
    ctx.fillStyle = shirtColor;
    ctx.fillRect(fx - 5, cy - 6, 10, 8);

    // Arm
    ctx.fillStyle = skinColor;
    ctx.fillRect(fx - 2 + armSwing1, cy - 2, 4, 8);

    // Head Side
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.arc(fx, cy - 10 + headBob, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hairColor;
    ctx.fillRect(fx - 6, cy - 16 + headBob, 6, 8);

    // Nose
    ctx.fillStyle = skinColor;
    ctx.fillRect(fx + 5, cy - 10 + headBob, 3, 3);

    // Straw Hat Side
    ctx.fillStyle = hatColor;
    ctx.beginPath();
    ctx.ellipse(fx, cy - 11 + headBob, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hatRibbon;
    ctx.fillRect(fx - 9, cy - 14 + headBob, 18, 3);
    ctx.fillStyle = hatColor;
    ctx.beginPath();
    ctx.arc(fx, cy - 14 + headBob, 7, Math.PI, 0);
    ctx.fill();

    // Tool Action Swing
    if (step === 3) {
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(fx + 4, cy - 4, 14, 3);
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(fx + 16, cy - 8, 4, 11);
    }

    ctx.restore();
    return;
  }

  // FRONT / DOWN VIEW (dir === 0)
  // Boots
  ctx.fillStyle = bootColor;
  ctx.fillRect(cx - 7, cy + 12 + legOffset1, 5, 6);
  ctx.fillRect(cx + 2, cy + 12 + legOffset2, 5, 6);

  // Overalls / Pants
  ctx.fillStyle = overallColor;
  ctx.fillRect(cx - 8, cy + 2, 16, 12);

  // Yellow Buttons & Straps
  ctx.fillStyle = overallDark;
  ctx.fillRect(cx - 6, cy - 4, 3, 7);
  ctx.fillRect(cx + 3, cy - 4, 3, 7);
  ctx.fillStyle = '#f1c40f';
  ctx.fillRect(cx - 6, cy + 1, 3, 3);
  ctx.fillRect(cx + 3, cy + 1, 3, 3);

  // Red Shirt
  ctx.fillStyle = shirtColor;
  ctx.fillRect(cx - 7, cy - 6, 14, 4);

  // Arms
  ctx.fillStyle = skinColor;
  ctx.fillRect(cx - 10, cy - 4 + armSwing1, 3, 9);
  ctx.fillRect(cx + 7, cy - 4 + armSwing2, 3, 9);

  // Head / Face Front
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.arc(cx, cy - 10 + headBob, 8, 0, Math.PI * 2);
  ctx.fill();

  // Hair Fringe
  ctx.fillStyle = hairColor;
  ctx.fillRect(cx - 7, cy - 17 + headBob, 14, 5);

  // Eyes (Classic Cute Dots)
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(cx - 4, cy - 10 + headBob, 2, 3);
  ctx.fillRect(cx + 2, cy - 10 + headBob, 2, 3);
  // Blush
  ctx.fillStyle = '#e84118';
  ctx.fillRect(cx - 6, cy - 7 + headBob, 2, 2);
  ctx.fillRect(cx + 4, cy - 7 + headBob, 2, 2);

  // Straw Hat
  ctx.fillStyle = hatColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 13 + headBob, 15, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hatRibbon;
  ctx.fillRect(cx - 10, cy - 17 + headBob, 20, 3);
  ctx.fillStyle = hatColor;
  ctx.beginPath();
  ctx.arc(cx, cy - 17 + headBob, 8, Math.PI, 0);
  ctx.fill();

  // Action (Holding crop or tool)
  if (step === 3) {
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(cx - 2, cy + 4, 4, 12);
  }
}
