import Phaser from 'phaser';
import { FarmScene } from './scenes/FarmScene.js';
import { UIScene }   from './scenes/UIScene.js';
import { audioService } from './services/AudioService.js';

class FarmGameApp {
  constructor() {
    // Game State
    this.gold = 500;
    this.stamina = 100;
    this.maxStamina = 100;
    this.day = 1;
    this.hour = 6;
    this.minute = 0;
    this.totalHarvested = 0;

    this.activeTool = 'hoe'; // 'hoe', 'water', 'seed_turnip', 'seed_strawberry', 'seed_tomato', 'seed_corn', 'harvest'

    this.inventory = {
      seeds: {
        turnip: 3,
        strawberry: 2,
        tomato: 1,
        corn: 1
      }
    };

    this.cropPrices = {
      turnip: 50,
      strawberry: 90,
      tomato: 140,
      corn: 210
    };

    this.seedPrices = {
      turnip: 20,
      strawberry: 40,
      tomato: 60,
      corn: 90
    };

    this.cropNames = {
      turnip: '白蘿蔔',
      strawberry: '鮮紅草莓',
      tomato: '多汁番茄',
      corn: '黃金玉米'
    };

    // Global reference for Phaser scenes to access state
    window.farmApp = this;

    this.initPhaser();
    this.initUI();
    this.startClock();
  }

  initPhaser() {
    const config = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 1024,
      height: 640,
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [FarmScene, UIScene]
    };

    this.game = new Phaser.Game(config);
  }

  getFarmScene() {
    return this.game.scene.getScene('FarmScene');
  }

  initUI() {
    // Tool selection hotbar buttons
    const toolBtns = document.querySelectorAll('.hotbar-item');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tool = btn.getAttribute('data-tool');
        this.selectTool(tool);
      });
    });

    // Shop modal toggle
    const shopBtn = document.getElementById('shop-btn');
    const closeShopBtn = document.getElementById('close-shop-btn');
    const shopModal = document.getElementById('shop-modal');

    shopBtn.addEventListener('click', () => {
      audioService.playCoin();
      shopModal.classList.add('active');
    });

    closeShopBtn.addEventListener('click', () => {
      shopModal.classList.remove('active');
    });

    // Sleep button
    const sleepBtn = document.getElementById('sleep-btn');
    sleepBtn.addEventListener('click', () => {
      this.sleepAndAdvanceDay();
    });

    // Shop Buy items
    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cropType = btn.getAttribute('data-crop');
        const price = this.seedPrices[cropType];
        if (this.gold >= price) {
          this.gold -= price;
          this.inventory.seeds[cropType] = (this.inventory.seeds[cropType] || 0) + 1;
          audioService.playCoin();
          this.showToast(`成功購買 1 包 ${this.getCropName(cropType)} 種子！`);
          this.updateHUD();
        } else {
          this.showToast('金幣不足，無法購買該種子！');
        }
      });
    });

    this.updateHUD();
  }

  selectTool(tool) {
    this.activeTool = tool;
    document.querySelectorAll('.hotbar-item').forEach(b => {
      if (b.getAttribute('data-tool') === tool) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
    audioService.playPlant();
  }

  useStamina(amount) {
    this.stamina = Math.max(0, this.stamina - amount);
    this.updateHUD();
  }

  addGold(amount) {
    this.gold += amount;
    this.updateHUD();
  }

  getCropName(type) {
    return this.cropNames[type] || type;
  }

  updateHUD() {
    // Money
    document.getElementById('gold-count').innerText = `${this.gold} G`;

    // Stamina Bar & Text
    const stamPercent = Math.round((this.stamina / this.maxStamina) * 100);
    const stamFill = document.getElementById('stamina-fill');
    const stamText = document.getElementById('stamina-text');
    stamFill.style.width = `${stamPercent}%`;
    stamText.innerText = `${this.stamina} / ${this.maxStamina}`;

    if (stamPercent < 25) {
      stamFill.style.backgroundColor = '#ef5350';
    } else if (stamPercent < 50) {
      stamFill.style.backgroundColor = '#ffa726';
    } else {
      stamFill.style.backgroundColor = '#66bb6a';
    }

    // Day & Clock
    document.getElementById('day-display').innerText = `第 ${this.day} 天 (Day ${this.day})`;

    const hStr = String(this.hour).padStart(2, '0');
    const mStr = String(this.minute).padStart(2, '0');
    const period = this.hour >= 12 ? 'PM' : 'AM';
    document.getElementById('clock-display').innerText = `${hStr}:${mStr} ${period}`;

    // Seed Counts in Hotbar
    document.getElementById('count-turnip').innerText = `x${this.inventory.seeds.turnip || 0}`;
    document.getElementById('count-strawberry').innerText = `x${this.inventory.seeds.strawberry || 0}`;
    document.getElementById('count-tomato').innerText = `x${this.inventory.seeds.tomato || 0}`;
    document.getElementById('count-corn').innerText = `x${this.inventory.seeds.corn || 0}`;
  }

  startClock() {
    // 1 real second = 10 game minutes
    setInterval(() => {
      this.minute += 10;
      if (this.minute >= 60) {
        this.minute = 0;
        this.hour++;

        // Sync tint with FarmScene
        const farmScene = this.getFarmScene();
        if (farmScene && farmScene.setDayNightTint) {
          farmScene.setDayNightTint(this.hour);
        }

        if (this.hour >= 24) {
          this.showToast('🌙 夜深了，你太累昏倒過去睡著了...');
          this.sleepAndAdvanceDay();
        }
      }
      this.updateHUD();
    }, 1000);
  }

  sleepAndAdvanceDay() {
    audioService.playDayChime();

    // Show Day Transition Overlay Banner
    const overlay = document.getElementById('day-transition-overlay');
    const title = document.getElementById('day-banner-title');
    title.innerText = `第 ${this.day + 1} 天 ☀️ 清晨 06:00`;

    overlay.classList.add('active');

    setTimeout(() => {
      // Update Game State
      this.day++;
      this.hour = 6;
      this.minute = 0;
      this.stamina = this.maxStamina;
      this.updateHUD();

      // Trigger FarmScene Crop Growth & Soil Reset
      const farmScene = this.getFarmScene();
      if (farmScene && farmScene.advanceDay) {
        farmScene.advanceDay();
        farmScene.setDayNightTint(6);
      }

      setTimeout(() => {
        overlay.classList.remove('active');
      }, 1200);
    }, 1000);
  }

  showToast(message) {
    const toast = document.getElementById('toast-notification');
    toast.innerText = message;
    toast.classList.add('show');

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

// Start application when DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  new FarmGameApp();
});
