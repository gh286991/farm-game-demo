import Phaser from 'phaser';

// ─────────────────────────────────────────────────────────
//  UIScene – always-on-top Phaser scene for in-game HUD
//  Runs parallel to FarmScene (not replacing it)
// ─────────────────────────────────────────────────────────
const TOOLS = [
  { key: 'hoe',      label: '鋤頭',   emoji: '⛏️',  shortcut: '1', color: 0x8d6e63 },
  { key: 'watering', label: '澆水',   emoji: '💧',  shortcut: '2', color: 0x42a5f5 },
  { key: 'seed',     label: '播種',   emoji: '🌱',  shortcut: '3', color: 0x66bb6a },
  { key: 'harvest',  label: '收穫',   emoji: '🌾',  shortcut: '4', color: 0xffa726 },
];

const SLOT_SIZE  = 68;
const SLOT_GAP   = 8;
const BAR_PAD    = 14;
const BAR_H      = SLOT_SIZE + BAR_PAD * 2;
const BAR_W      = TOOLS.length * (SLOT_SIZE + SLOT_GAP) - SLOT_GAP + BAR_PAD * 2;

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: true });
  }

  preload() {
    this.load.image('ui_hotbar_bg', '/assets/ui_hotbar_bg.jpg');
  }

  create() {
    const { width, height } = this.cameras.main;
    this.selectedTool = 'hoe';

    // ── Generate programmatic UI textures ──────────────────
    this._makeSlotTextures();

    // ── Hotbar panel ───────────────────────────────────────
    const barX = width / 2;
    const barY = height - BAR_H / 2 - 12;

    // Use generated hotbar image scaled to fit, or draw fallback
    this.hotbarBg = this.add.image(barX, barY, 'ui_hotbar_bg')
      .setDisplaySize(BAR_W + 20, BAR_H + 8)
      .setDepth(900)
      .setAlpha(0.95);

    // ── Tool slots ─────────────────────────────────────────
    this.slots = [];
    this.slotBgs = [];

    const totalW = TOOLS.length * (SLOT_SIZE + SLOT_GAP) - SLOT_GAP;
    const startX = barX - totalW / 2 + SLOT_SIZE / 2;

    TOOLS.forEach((tool, i) => {
      const sx = startX + i * (SLOT_SIZE + SLOT_GAP);
      const sy = barY;

      // Slot background (dark inset)
      const slotBg = this.add.rectangle(sx, sy, SLOT_SIZE, SLOT_SIZE, 0x2c1a0e, 0.7)
        .setDepth(901)
        .setStrokeStyle(2, 0x6d4c41);

      // Tool icon (emoji rendered onto canvas texture)
      const iconKey = `tool_icon_${tool.key}`;
      if (!this.textures.exists(iconKey)) {
        this._makeToolIcon(iconKey, tool.emoji, tool.color);
      }
      const icon = this.add.image(sx, sy, iconKey)
        .setDisplaySize(SLOT_SIZE - 8, SLOT_SIZE - 8)
        .setDepth(902);

      // Shortcut number label
      const numLabel = this.add.text(sx - SLOT_SIZE / 2 + 6, sy - SLOT_SIZE / 2 + 4, tool.shortcut, {
        fontFamily: '"Fredoka", sans-serif',
        fontSize: '14px',
        color: '#f5deb3',
        stroke: '#000',
        strokeThickness: 2
      }).setDepth(903).setOrigin(0, 0);

      // Tool name label (below icon)
      const nameLabel = this.add.text(sx, sy + SLOT_SIZE / 2 + 2, tool.label, {
        fontFamily: '"Fredoka", sans-serif',
        fontSize: '11px',
        color: '#ffe0b2',
        stroke: '#3e1f00',
        strokeThickness: 3
      }).setDepth(903).setOrigin(0.5, 0);

      // Click/tap interaction
      slotBg.setInteractive({ useHandCursor: true });
      icon.setInteractive({ useHandCursor: true });

      const selectThis = () => this.selectTool(tool.key, i);
      slotBg.on('pointerdown', selectThis);
      icon.on('pointerdown', selectThis);

      // Hover effect
      slotBg.on('pointerover', () => {
        if (this.selectedTool !== tool.key) slotBg.setFillStyle(0x4e342e, 0.8);
      });
      slotBg.on('pointerout', () => {
        if (this.selectedTool !== tool.key) slotBg.setFillStyle(0x2c1a0e, 0.7);
      });

      this.slots.push({ tool, slotBg, icon, numLabel, nameLabel, sx, sy });
    });

    // ── Gold panel (top-left) ──────────────────────────────
    this._buildStatusPanel(width, height);

    // ── Day/Time panel (top-center) ───────────────────────
    this._buildTimePanel(width);

    // ── Keyboard shortcuts 1-4 ─────────────────────────────
    this._setupKeyboard();

    // ── Initial selection ──────────────────────────────────
    this.selectTool('hoe', 0);

    // ── Polling update for stats ───────────────────────────
    this.time.addEvent({ delay: 100, callback: this.pollStats, callbackScope: this, loop: true });
  }

  // ─── Tool Icons (canvas-drawn emoji) ─────────────────────
  _makeToolIcon(key, emoji, bgColor) {
    const size = 56;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');

    // Circular gradient bg
    const grad = ctx.createRadialGradient(size/2, size/2, 4, size/2, size/2, size/2);
    const r = (bgColor >> 16) & 0xff;
    const g = (bgColor >> 8)  & 0xff;
    const b =  bgColor        & 0xff;
    grad.addColorStop(0, `rgba(${r},${g},${b},0.6)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0.0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI*2);
    ctx.fill();

    // Emoji
    ctx.font = `${size * 0.6}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size/2, size/2 + 2);

    this.textures.addCanvas(key, c);
  }

  _makeSlotTextures() {
    // Selected glow border (golden)
    if (!this.textures.exists('slot_selected')) {
      const c = document.createElement('canvas');
      c.width = c.height = SLOT_SIZE;
      const ctx = c.getContext('2d');
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 12;
      ctx.strokeRect(2, 2, SLOT_SIZE - 4, SLOT_SIZE - 4);
      this.textures.addCanvas('slot_selected', c);
    }
  }

  // ─── Select a tool ────────────────────────────────────────
  selectTool(toolKey, index) {
    this.selectedTool = toolKey;

    this.slots.forEach((s, i) => {
      const isActive = s.tool.key === toolKey;
      // Active slot: gold outline, lighter bg
      if (isActive) {
        s.slotBg.setFillStyle(0x5d3a1a, 0.9);
        s.slotBg.setStrokeStyle(3, 0xffd700);
        s.icon.setScale(1.12);
      } else {
        s.slotBg.setFillStyle(0x2c1a0e, 0.7);
        s.slotBg.setStrokeStyle(2, 0x6d4c41);
        s.icon.setScale(1.0);
      }
    });

    // Pop animation on selected icon
    const sel = this.slots.find(s => s.tool.key === toolKey);
    if (sel) {
      this.tweens.add({
        targets: sel.icon,
        scaleX: 1.3, scaleY: 1.3,
        duration: 100,
        yoyo: true,
        ease: 'Back.easeOut'
      });
    }

    // Sync with FarmScene registry
    const farmScene = this.scene.get('FarmScene');
    if (farmScene?.registry) {
      farmScene.registry.set('currentTool', toolKey);
    }

    // Update tool indicator text
    const toolDef = TOOLS.find(t => t.key === toolKey);
    if (this.toolIndicator && toolDef) {
      this.toolIndicator.setText(`🛠 ${toolDef.label}`);
    }
  }

  // ─── Status Panel (top-left) ─────────────────────────────
  _buildStatusPanel(width, height) {
    const px = 12, py = 12;
    const pw = 200, ph = 110;

    // Panel bg
    const panelBg = this.add.graphics().setDepth(900);
    panelBg.fillStyle(0x1a0f00, 0.82);
    panelBg.strokeStyle(0x8d6e63, 1);
    this._roundRect(panelBg, px, py, pw, ph, 10);
    panelBg.fillRoundedRect(px, py, pw, ph, 10);
    panelBg.strokeRoundedRect(px, py, pw, ph, 10);

    const textStyle = {
      fontFamily: '"Fredoka", "Noto Sans TC", sans-serif',
      fontSize: '17px',
      color: '#ffe0b2',
      stroke: '#3e1f00',
      strokeThickness: 3
    };
    const smallStyle = { ...textStyle, fontSize: '14px', color: '#ffcc80' };

    this.goldText    = this.add.text(px + 12, py + 10, '💰 金幣: 500 G', textStyle).setDepth(901);
    this.staminaText = this.add.text(px + 12, py + 36, '⚡ 體力: 100 / 100', smallStyle).setDepth(901);
    this.dayText     = this.add.text(px + 12, py + 58, '📅 Day 1', smallStyle).setDepth(901);

    // Stamina bar
    this.staminaBarBg = this.add.rectangle(px + 12 + 2, py + 82, 176, 14, 0x3e2723).setOrigin(0, 0.5).setDepth(901);
    this.staminaBar   = this.add.rectangle(px + 12 + 2, py + 82, 176, 14, 0x4caf50).setOrigin(0, 0.5).setDepth(902);
    this.staminaBarBorder = this.add.rectangle(px + 12 + 2, py + 82, 176, 14, 0x000000, 0)
      .setOrigin(0, 0.5).setDepth(903).setStrokeStyle(1, 0x8d6e63);

    // Tool indicator bottom of status
    this.toolIndicator = this.add.text(px + 12, py + ph + 6, '🛠 鋤頭', {
      ...smallStyle, color: '#ffd700'
    }).setDepth(901);
  }

  // ─── Time Panel (top-right) ───────────────────────────────
  _buildTimePanel(width) {
    const pw = 180, ph = 60;
    const px = width - pw - 12, py = 12;

    const panelBg = this.add.graphics().setDepth(900);
    panelBg.fillStyle(0x1a0f00, 0.82);
    panelBg.strokeStyle(0x8d6e63, 1);
    panelBg.fillRoundedRect(px, py, pw, ph, 10);
    panelBg.strokeRoundedRect(px, py, pw, ph, 10);

    const textStyle = {
      fontFamily: '"Fredoka", "Noto Sans TC", sans-serif',
      fontSize: '16px',
      color: '#ffe0b2',
      stroke: '#3e1f00',
      strokeThickness: 3
    };

    this.timeText = this.add.text(px + pw / 2, py + 16, '🌅 06:00 AM', textStyle)
      .setOrigin(0.5, 0).setDepth(901);
    this.seasonText = this.add.text(px + pw / 2, py + 38, '🌸 Spring 1', {
      ...textStyle, fontSize: '13px', color: '#a5d6a7'
    }).setOrigin(0.5, 0).setDepth(901);
  }

  _roundRect(g, x, y, w, h, r) { /* noop – using fillRoundedRect directly */ }

  // ─── Keyboard shortcuts ───────────────────────────────────
  _setupKeyboard() {
    const keys = ['ONE', 'TWO', 'THREE', 'FOUR'];
    keys.forEach((k, i) => {
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[k]).on('down', () => {
        if (TOOLS[i]) this.selectTool(TOOLS[i].key, i);
      });
    });
  }

  // ─── Polling stats from FarmScene registry ────────────────
  pollStats() {
    const farmScene = this.scene.get('FarmScene');
    if (!farmScene) return;

    const gold    = farmScene.registry.get('gold')    ?? 500;
    const stamina = farmScene.registry.get('stamina') ?? 100;
    const maxSt   = farmScene.registry.get('maxStamina') ?? 100;
    const day     = farmScene.registry.get('day')     ?? 1;
    const hour    = farmScene.registry.get('hour')    ?? 6;
    const minute  = farmScene.registry.get('minute')  ?? 0;

    if (this.goldText)    this.goldText.setText(`💰 金幣: ${gold} G`);
    if (this.staminaText) this.staminaText.setText(`⚡ 體力: ${stamina} / ${maxSt}`);
    if (this.dayText)     this.dayText.setText(`📅 Day ${day}`);

    // Stamina bar width
    const ratio = Math.max(0, Math.min(1, stamina / maxSt));
    if (this.staminaBar) {
      this.staminaBar.width = 176 * ratio;
      const color = ratio > 0.6 ? 0x4caf50 : ratio > 0.3 ? 0xffa726 : 0xf44336;
      this.staminaBar.setFillStyle(color);
    }

    // Time display
    if (this.timeText) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const h12  = ((hour - 1 + 12) % 12) + 1;
      const icon = hour >= 18 ? '🌙' : hour >= 12 ? '☀️' : hour >= 6 ? '🌅' : '🌃';
      this.timeText.setText(`${icon} ${String(h12).padStart(2,'0')}:${String(minute).padStart(2,'0')} ${ampm}`);
    }
  }
}
