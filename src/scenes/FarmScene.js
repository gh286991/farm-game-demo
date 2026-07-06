import Phaser from 'phaser';
import { audioService } from '../services/AudioService.js';

// ─────────────────────────────────────────────
//  MAP LAYOUT  (0=grass, 3=dirt path)
//  All grass tiles inside the farm are tillable!
// ─────────────────────────────────────────────
const TILE_SIZE = 64;
const MAP_COLS  = 25;
const MAP_ROWS  = 18;

const BASE_MAP = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,0,0,0],
  [0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,0,0,0],
  [0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,0,0,0],
  [0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,0,0,0],
  [0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,0,0,0],
  [0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,0,0,0],
  [0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,0,0,0],
  [0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,0,0,0],
  [0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,3,3,0,0,0,0,0],
  [0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const OBJECTS = [
  { key: 'obj_cottage',      col: 20, row: 1,  tileW: 4,   tileH: 5,   depth: 10 },
  { key: 'obj_apple_tree',   col: 1,  row: 1,  tileW: 2.5, tileH: 3,   depth: 5  },
  { key: 'obj_apple_tree',   col: 1,  row: 5,  tileW: 2.5, tileH: 3,   depth: 5  },
  { key: 'obj_apple_tree',   col: 1,  row: 9,  tileW: 2.5, tileH: 3,   depth: 5  },
  { key: 'obj_apple_tree',   col: 1,  row: 13, tileW: 2.5, tileH: 3,   depth: 5  },
  { key: 'obj_wooden_fence', col: 4,  row: 3,  tileW: 3,   tileH: 1.2, depth: 4  },
  { key: 'obj_wooden_fence', col: 8,  row: 3,  tileW: 3,   tileH: 1.2, depth: 4  },
  { key: 'obj_wooden_fence', col: 12, row: 3,  tileW: 3,   tileH: 1.2, depth: 4  },
  { key: 'obj_wooden_fence', col: 16, row: 3,  tileW: 3,   tileH: 1.2, depth: 4  },
  { key: 'obj_shipping_bin', col: 20, row: 9,  tileW: 2,   tileH: 2,   depth: 8  },
  { key: 'obj_water_well',   col: 21, row: 7,  tileW: 2,   tileH: 2.5, depth: 8  },
  { key: 'obj_scarecrow',    col: 8,  row: 7,  tileW: 1.5, tileH: 2.5, depth: 6  },
  { key: 'obj_flowers',      col: 21, row: 12, tileW: 2,   tileH: 2,   depth: 5  },
  { key: 'obj_flowers',      col: 21, row: 14, tileW: 2,   tileH: 2,   depth: 5  },
];

export class FarmScene extends Phaser.Scene {
  constructor() {
    super('FarmScene');
  }

  preload() {
    // Tile textures
    this.load.image('tile_grass',     '/assets/tile_grass.jpg');
    this.load.image('tile_soil_dry',  '/assets/tile_soil_dry.jpg');
    this.load.image('tile_soil_wet',  '/assets/tile_soil_wet.jpg');
    this.load.image('tile_path_dirt', '/assets/tile_path_dirt.jpg');

    // Object sprites
    this.load.image('obj_cottage',      '/assets/obj_cottage.jpg');
    this.load.image('obj_apple_tree',   '/assets/obj_apple_tree.jpg');
    this.load.image('obj_wooden_fence', '/assets/obj_wooden_fence.jpg');
    this.load.image('obj_shipping_bin', '/assets/obj_shipping_bin.jpg');
    this.load.image('obj_water_well',   '/assets/obj_water_well.jpg');
    this.load.image('obj_scarecrow',    '/assets/obj_scarecrow.jpg');
    this.load.image('obj_flowers',      '/assets/obj_flowers.jpg');

    // Gemini-generated farmer spritesheet
    this.load.image('farmer_sheet_raw', '/assets/farmer_spritesheet.jpg');
  }

  create() {
    const totalW = MAP_COLS * TILE_SIZE;
    const totalH = MAP_ROWS * TILE_SIZE;

    // ── 1. Spritesheet ─────────────────────────────────────
    this._buildFarmerSpritesheet();

    // ── 2. Tilemap ──────────────────────────────────────────
    this.tileRefs = {};
    this._buildTilemap();

    // ── 3. Objects (chroma-key) ─────────────────────────────
    this.staticObstacles = this.physics.add.staticGroup();
    this._buildObjects();

    // ── 4. Soil grid state ──────────────────────────────────
    this.soilTiles = {};

    // ── 5. Player ───────────────────────────────────────────
    const px = 11 * TILE_SIZE + TILE_SIZE / 2;
    const py = 9  * TILE_SIZE + TILE_SIZE / 2;
    this.player = this.physics.add.sprite(px, py, 'farmer_sprite', 0);
    this.player.setScale(0.28).setDepth(50).setCollideWorldBounds(true);
    this.player.body.setSize(48, 52).setOffset(104, 180);

    this._createAnims();
    this.player.play('idle_down');
    this.facing = 'down';

    // ── 6. Collider ─────────────────────────────────────────
    this.physics.add.collider(this.player, this.staticObstacles);

    // ── 7. Camera ───────────────────────────────────────────
    this.physics.world.setBounds(0, 0, totalW, totalH);
    this.cameras.main.setBounds(0, 0, totalW, totalH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // ── 8. Day/Night overlay ────────────────────────────────
    this.dayOverlay = this.add.rectangle(0, 0, totalW * 3, totalH * 3, 0x000033, 0)
      .setOrigin(0, 0).setDepth(200).setScrollFactor(0);

    // ── 9. Tile highlight cursor ────────────────────────────
    this.tileCursor = this.add.rectangle(0, 0, TILE_SIZE, TILE_SIZE, 0xffffff, 0.2)
      .setStrokeStyle(3, 0xffd700, 0.95).setDepth(60).setVisible(false);

    // ── 10. Input ───────────────────────────────────────────
    this.cursors  = this.input.keyboard.createCursorKeys();
    this.wasd     = this.input.keyboard.addKeys({ up:'W', down:'S', left:'A', right:'D' });
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.eKey     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Pointer click/tap support on main game map
    this.input.on('pointerdown', (pointer) => {
      // Ignore clicks near bottom hotbar (UI height ~100px)
      if (pointer.y > this.cameras.main.height - 95) return;
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const col = Math.floor(worldPoint.x / TILE_SIZE);
      const row = Math.floor(worldPoint.y / TILE_SIZE);
      this._doActionOnTile(col, row);
    });

    // ── 11. Registry init ───────────────────────────────────
    this.registry.set('gold',       500);
    this.registry.set('stamina',    100);
    this.registry.set('maxStamina', 100);
    this.registry.set('day',        1);
    this.registry.set('hour',       6);
    this.registry.set('minute',     0);
    this.registry.set('currentTool','hoe');

    // ── 12. Game clock ──────────────────────────────────────
    this.time.addEvent({ delay: 1000, callback: this._tickClock, callbackScope: this, loop: true });

    // ── 13. Crop growth sprites ─────────────────────────────
    this.cropSprites = {};
  }

  // ─── Build farmer spritesheet ──────────────────────────────
  _buildFarmerSpritesheet() {
    const src = this.textures.get('farmer_sheet_raw').getSourceImage();
    const fw = Math.floor(src.width  / 4);
    const fh = Math.floor(src.height / 4);

    const canvas = document.createElement('canvas');
    canvas.width  = src.width;
    canvas.height = src.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(src, 0, 0);

    const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] > 230 && d[i+1] > 230 && d[i+2] > 230) d[i+3] = 0;
    }
    ctx.putImageData(id, 0, 0);

    this.textures.addSpriteSheet('farmer_sprite', canvas, {
      frameWidth:  fw,
      frameHeight: fh
    });
  }

  // ─── Animations ───────────────────────────────────────────
  _createAnims() {
    const dirs = [
      { key: 'down',  row: 0 },
      { key: 'up',    row: 1 },
      { key: 'left',  row: 2 },
      { key: 'right', row: 3 },
    ];
    dirs.forEach(({ key, row }) => {
      if (!this.anims.exists(`walk_${key}`)) {
        this.anims.create({
          key: `walk_${key}`,
          frames: this.anims.generateFrameNumbers('farmer_sprite', { start: row*4, end: row*4+3 }),
          frameRate: 8, repeat: -1
        });
      }
      if (!this.anims.exists(`idle_${key}`)) {
        this.anims.create({
          key: `idle_${key}`,
          frames: this.anims.generateFrameNumbers('farmer_sprite', { start: row*4, end: row*4 }),
          frameRate: 1, repeat: -1
        });
      }
    });
  }

  // ─── Tilemap ──────────────────────────────────────────────
  _buildTilemap() {
    const tileKeys = ['tile_grass', 'tile_soil_dry', 'tile_soil_wet', 'tile_path_dirt'];
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const key = tileKeys[BASE_MAP[row][col]];
        const x   = col * TILE_SIZE + TILE_SIZE / 2;
        const y   = row * TILE_SIZE + TILE_SIZE / 2;
        const img = this.add.image(x, y, key)
          .setDisplaySize(TILE_SIZE + 1, TILE_SIZE + 1).setDepth(0);
        this.tileRefs[`${col},${row}`] = { img };
      }
    }
  }

  // ─── Object sprites (chroma-key) ──────────────────────────
  _buildObjects() {
    OBJECTS.forEach(obj => {
      const keyMasked = `${obj.key}_masked`;
      if (!this.textures.exists(keyMasked)) this._chromaKey(obj.key, keyMasked);

      const x = obj.col * TILE_SIZE, y = obj.row * TILE_SIZE;
      const w = obj.tileW * TILE_SIZE, h = obj.tileH * TILE_SIZE;

      this.add.image(x, y, keyMasked)
        .setOrigin(0, 0).setDisplaySize(w, h).setDepth(obj.depth);

      if (obj.tileW >= 2) {
        const body = this.add.rectangle(x + w/2, y + h*0.8, w*0.7, h*0.25, 0,0);
        this.physics.add.existing(body, true);
        this.staticObstacles.add(body);
      }
    });
  }

  _chromaKey(srcKey, dstKey) {
    const frame  = this.textures.get(srcKey).getSourceImage();
    const c = document.createElement('canvas');
    c.width = frame.width; c.height = frame.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(frame, 0, 0);
    const id = ctx.getImageData(0, 0, c.width, c.height);
    const d  = id.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] > 180 && d[i+1] < 80 && d[i+2] > 180) d[i+3] = 0;
    }
    ctx.putImageData(id, 0, 0);
    this.textures.addCanvas(dstKey, c);
  }

  // ─── UPDATE ───────────────────────────────────────────────
  update() {
    this._handleMovement();
    this._updateCursor();
    this._handleKeyboardAction();
  }

  _handleMovement() {
    const speed = 180;
    const { cursors, wasd } = this;
    const up    = cursors.up.isDown    || wasd.up.isDown;
    const down  = cursors.down.isDown  || wasd.down.isDown;
    const left  = cursors.left.isDown  || wasd.left.isDown;
    const right = cursors.right.isDown || wasd.right.isDown;

    this.player.body.setVelocity(0);
    if (left)  { this.player.body.setVelocityX(-speed); this.facing = 'left';  }
    if (right) { this.player.body.setVelocityX(speed);  this.facing = 'right'; }
    if (up)    { this.player.body.setVelocityY(-speed); this.facing = 'up';    }
    if (down)  { this.player.body.setVelocityY(speed);  this.facing = 'down';  }

    if ((left||right) && (up||down)) {
      this.player.body.velocity.normalize().scale(speed);
    }

    const moving = up || down || left || right;
    const anim   = `${moving ? 'walk' : 'idle'}_${this.facing}`;
    if (this.player.anims.currentAnim?.key !== anim) this.player.play(anim);
  }

  _updateCursor() {
    const dx = { down: 0, up: 0, left: -1, right: 1 };
    const dy = { down: 1, up: -1, left: 0, right: 0 };

    const pCol = Math.floor(this.player.x / TILE_SIZE);
    const pRow = Math.floor((this.player.y + 8) / TILE_SIZE);

    const frontCol = pCol + (dx[this.facing] || 0);
    const frontRow = pRow + (dy[this.facing] || 0);

    // Target front tile if within map, else current tile
    if (frontCol >= 0 && frontCol < MAP_COLS && frontRow >= 0 && frontRow < MAP_ROWS) {
      this.targetCol = frontCol;
      this.targetRow = frontRow;
    } else {
      this.targetCol = pCol;
      this.targetRow = pRow;
    }

    const isPath = BASE_MAP[this.targetRow]?.[this.targetCol] === 3;
    const isObstacle = this._isObstacleTile(this.targetCol, this.targetRow);

    if (!isPath && !isObstacle) {
      this.tileCursor
        .setVisible(true)
        .setPosition(this.targetCol * TILE_SIZE + TILE_SIZE/2, this.targetRow * TILE_SIZE + TILE_SIZE/2);
    } else {
      this.tileCursor.setVisible(false);
    }
  }

  _isObstacleTile(col, row) {
    return OBJECTS.some(o => 
      col >= o.col && col < o.col + o.tileW &&
      row >= o.row && row < o.row + o.tileH
    );
  }

  _handleKeyboardAction() {
    const spaceJust = Phaser.Input.Keyboard.JustDown(this.spaceKey);
    const eJust     = Phaser.Input.Keyboard.JustDown(this.eKey);
    if (spaceJust || eJust) {
      try {
        this._doActionOnTile(this.targetCol, this.targetRow);
      } catch (err) {
        console.error('Key action error:', err);
      }
    }
  }

  // ───────────────────────────────────────────────────────────
  //  CORE FARMING ACTION DISPATCHER
  // ───────────────────────────────────────────────────────────
  _doActionOnTile(col, row) {
    try {
      if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return;
      if (BASE_MAP[row]?.[col] === 3) return; // Dirt path cannot be farmed
      if (this._isObstacleTile(col, row)) return; // Buildings/trees cannot be farmed

      const key = `${col},${row}`;
      if (!this.soilTiles[key]) {
        this.soilTiles[key] = { tilled: false, watered: false, crop: null };
      }
      const tile = this.soilTiles[key];
      const tool = this.registry.get('currentTool') || 'hoe';

      if (tool === 'hoe') {
        if (!tile.tilled) {
          tile.tilled = true;
          this._swapTile(col, row, 'tile_soil_dry');
          this._fx(col, row, '⛏️ 翻土！', '#d4a373');
          this._drainStamina(8);
          audioService.play('hoe');
        } else {
          this._fx(col, row, '土已翻過', '#ffcc80');
        }

      } else if (tool === 'watering') {
        if (tile.tilled && !tile.watered) {
          tile.watered = true;
          this._swapTile(col, row, 'tile_soil_wet');
          this._fx(col, row, '💧 澆水！', '#90caf9');
          this._drainStamina(5);
          audioService.play('water');
          if (tile.crop) {
            this._scheduleGrowth(col, row, key, tile);
          }
        } else if (!tile.tilled) {
          this._fx(col, row, '請先用⛏️翻土！', '#ff6b6b');
        } else if (tile.watered) {
          this._fx(col, row, '土已濕潤', '#90caf9');
        }

      } else if (tool === 'seed') {
        if (tile.tilled && !tile.crop) {
          const seedTypes = ['turnip','strawberry','tomato','corn'];
          const seedType  = seedTypes[Math.floor(Math.random() * seedTypes.length)];
          tile.crop = { type: seedType, stage: 0, maxStage: 3 };
          this._drawCrop(col, row, 0);
          this._fx(col, row, '🌱 播種！', '#a5d6a7');
          this._drainStamina(5);
          audioService.play('plant');

          if (tile.watered) {
            this._scheduleGrowth(col, row, key, tile);
          }
        } else if (!tile.tilled) {
          this._fx(col, row, '請先用⛏️翻土！', '#ff6b6b');
        } else if (tile.crop) {
          this._fx(col, row, '這裡已有作物', '#ffcc80');
        }

      } else if (tool === 'harvest') {
        if (tile.crop && tile.crop.stage >= tile.crop.maxStage) {
          const cropType = tile.crop.type;
          const prices = { turnip: 50, strawberry: 90, tomato: 140, corn: 210 };
          const earned = prices[cropType] || 80;

          tile.crop    = null;
          tile.tilled  = false;
          tile.watered = false;

          this._swapTile(col, row, 'tile_grass');
          this._removeCrop(col, row);
          this._fx(col, row, `+${earned}G 🌾 採收！`, '#ffd700');
          this._drainStamina(10);

          this.registry.set('gold', (this.registry.get('gold') ?? 500) + earned);
          audioService.play('harvest');
        } else if (tile.crop) {
          this._fx(col, row, '⏳ 還沒成熟！', '#ffcc80');
        } else {
          this._fx(col, row, '這裡沒有成熟作物', '#aaa');
        }
      }
    } catch (err) {
      console.error('Tile action error:', err);
    }
  }

  // ─── Crop growth ──────────────────────────────────────────
  _scheduleGrowth(col, row, key, tile) {
    if (!tile.crop || tile.crop.stage >= tile.crop.maxStage) return;
    this.time.delayedCall(3500, () => {
      if (!tile.crop) return;
      tile.crop.stage++;
      tile.watered = false;
      this._swapTile(col, row, 'tile_soil_dry');
      this._drawCrop(col, row, tile.crop.stage);
      if (tile.crop.stage < tile.crop.maxStage) {
        this._fx(col, row, '🌿 發芽長大！', '#a5d6a7');
      } else {
        this._fx(col, row, '✅ 成熟可收穫！', '#ffd700');
      }
    });
  }

  // ─── Tile helpers ─────────────────────────────────────────
  _swapTile(col, row, tileKey) {
    const ref = this.tileRefs[`${col},${row}`];
    if (ref) ref.img.setTexture(tileKey);
  }

  _drawCrop(col, row, stage) {
    this._removeCrop(col, row);
    const icons = ['🌱','🌿','🌾','🌻'];
    const sizes = [28, 34, 40, 46];
    const x = col * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE + TILE_SIZE / 2;
    const t = this.add.text(x, y, icons[Math.min(stage, icons.length-1)], {
      fontSize: `${sizes[Math.min(stage, sizes.length-1)]}px`
    }).setOrigin(0.5).setDepth(20);
    this.cropSprites[`${col},${row}`] = t;
  }

  _removeCrop(col, row) {
    const s = this.cropSprites?.[`${col},${row}`];
    if (s) { s.destroy(); delete this.cropSprites[`${col},${row}`]; }
  }

  _fx(col, row, text, color = '#ffffff') {
    const x = col * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE - 4;
    const t = this.add.text(x, y, text, {
      fontFamily: '"Fredoka", "Noto Sans TC", sans-serif',
      fontSize: '18px',
      color,
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5, 1).setDepth(80);
    this.tweens.add({
      targets: t, y: y - 50, alpha: 0,
      duration: 1000, ease: 'Power2',
      onComplete: () => t.destroy()
    });
  }

  _drainStamina(amount) {
    const cur = this.registry.get('stamina') ?? 100;
    this.registry.set('stamina', Math.max(0, cur - amount));
  }

  // ─── Clock ────────────────────────────────────────────────
  _tickClock() {
    let hour   = this.registry.get('hour')   ?? 6;
    let minute = this.registry.get('minute') ?? 0;
    let day    = this.registry.get('day')    ?? 1;

    minute += 10;
    if (minute >= 60) { minute = 0; hour++; }
    if (hour >= 24)   { hour = 6; day++; this._newDay(); }

    this.registry.set('hour',   hour);
    this.registry.set('minute', minute);
    this.registry.set('day',    day);

    const t = (hour - 6 + minute/60) / 18;
    const alpha = t < 0.4 ? 0 : t > 0.9 ? (t - 0.9) * 4 * 0.5 : 0;
    this.dayOverlay?.setAlpha(Math.min(0.55, alpha));
  }

  _newDay() {
    this.registry.set('stamina', this.registry.get('maxStamina') ?? 100);
    Object.entries(this.soilTiles).forEach(([k, tile]) => {
      if (tile.watered && tile.crop && tile.crop.stage < tile.crop.maxStage) {
        const [c, r] = k.split(',').map(Number);
        tile.crop.stage++;
        tile.watered = false;
        this._swapTile(c, r, 'tile_soil_dry');
        this._drawCrop(c, r, tile.crop.stage);
      }
    });

    const cam = this.cameras.main;
    const txt = this.add.text(
      cam.scrollX + cam.width/2,
      cam.scrollY + cam.height/2,
      `🌅 Day ${this.registry.get('day')}`,
      {
        fontFamily: '"Fredoka", "Noto Sans TC", sans-serif',
        fontSize: '52px',
        color: '#ffd700',
        stroke: '#3e1f00',
        strokeThickness: 6
      }
    ).setOrigin(0.5).setDepth(500).setAlpha(0);

    this.tweens.add({
      targets: txt,
      alpha: { from: 0, to: 1 },
      duration: 500,
      hold: 1200,
      yoyo: true,
      onComplete: () => txt.destroy()
    });
  }
}
