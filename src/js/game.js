const Tower = require('./entities/tower');
const GameMap = require('./entities/map');
const Layout = require('./lib/layout');
const Entity = require('./entities/entity');

const level = require('./levels/level-1');

const canvas = document.getElementById('game-canvas');

let lastRender = 0;
let stop = false;

class Game {
  constructor() {
    const map = new GameMap({
      names: ['map.jpg'],
      size: {
        width: 1600,
        height: 900,
      },
    });

    this.level = level;
    this.layout = new Layout(canvas, map);

    map.on('onClick', () => {
      if (this._pause) return;
      this.layout.closePopup();
    });

    this.wave = 0;
    this.money = 5000;
    this.health = 5;
    this._pause = false;

    this._createMenu();
    this._createPopups();
    this.level.places.forEach((place) => {
      place.on('onClick', this.placeClick.bind(this));
      this.layout.addEntity(place);
    });
  }


  _createPopups() {
    this._popups = {};

    this._popups.pause = new Entity({
      names: ['pause-bg.png'],
      position: {x: 0, y: 0},
      size: {width: 1600, height: 900},
    });

    const build = new Entity({
      names: ['53.png'],
      position: {x: 0, y: 0},
      centered: true,
      size: {width: 176, height: 170},
    });

    const buildFireTower = new Entity({
      names: ['12.png'],
      position: {x: -55, y: -60},
      relative: true,
      size: {width: 55, height: 60},
      centered: true,
    });
    buildFireTower.type = 'fire';

    const buildStoneTower = new Entity({
      names: ['25.png'],
      position: {x: 60, y: 60},
      relative: true,
      size: {width: 55, height: 60},
      centered: true,
    });
    buildStoneTower.type = 'stone';

    buildFireTower.on('onClick', this.buildClick.bind(this));
    buildStoneTower.on('onClick', this.buildClick.bind(this));

    build.appendChild(buildFireTower);
    build.appendChild(buildStoneTower);

    this._popups.build = build;
  }

  _createMenu() {
    const startX = 1600;
    const padding = 5;
    const size = 32;

    let count = 0;
    const nextPos = () => {
      count++;
      return {
        x: startX - size * count + (1 - count) * padding,
        y: 0,
      };
    };

    const pauseBtn = new Entity({
      names: ['pause-btn.png'],
      position: nextPos(),
    });

    pauseBtn.on('onClick', this.pauseClick.bind(this));

    this.layout.addMenuItem(pauseBtn);
  }

  pauseClick(e) {
    this._pause = !this._pause;

    this.layout.showPopup(this._popups.pause);
  }

  placeClick(e) {
    this._popups.build.position = {
      x: e.position.x + 16,
      y: e.position.y + 16,
    };

    this._popups.build.place = e;

    this.layout.showPopup(this._popups.build);
  }

  buildClick(e) {
    let names = [];

    const popup = e.parent;
    const place = popup.place;

    const pos = popup.getAbsolutePosition();
    let damage = 0;
    let cooldown = 0;

    if (e.type === 'fire') {
      names = ['12.png'];
      damage = 3;
      cooldown = 500;
    }
    if (e.type === 'stone') {
      names = ['6.png'];
      damage = 150;
      cooldown = 3000;
    }

    const tower = new Tower({
      names: names,
      position: pos,
      centered: true,
      size: {width: 36, height: 50},
      damage: damage,
      cooldown: cooldown,
    });

    this.layout.removeEntity(place);
    this.layout.addEntity(tower);
    this.layout.closePopup();
  }


  draw() {
    this.layout.draw();
  }

  start() {
    stop = false;

    this.generateEnemies();
    window.requestAnimationFrame(() => this._loop());
  }

  stop() {
    stop = true;
  }


  onEnemyDeath(enemy) {
    this.money += 50;

    this.layout.removeEntity(enemy);
    this.checkAliveEnemies();
  }

  onEnemyFinished(enemy) {
    this.health -= 1;

    this.layout.removeEntity(enemy);
    this.checkAliveEnemies();
  }

  checkAliveEnemies() {
    const enemies = this.layout.getEnemies();
    if (enemies.length === 0) {
      setTimeout(this.generateEnemies.bind(this), 3000);
    }
  }

  generateEnemies() {
    const onDeath = this.onEnemyDeath.bind(this);
    const onFinished = this.onEnemyFinished.bind(this);

    const enemies = this.level.generateEnemies(this.wave, onDeath, onFinished);

    enemies.forEach((enemy) => {
      this.layout.addEntity(enemy);
    });
  }

  update(progress) {
    const enemies = this.layout.getEnemies();
    const towers = this.layout.getTowers();

    enemies.forEach((enemy) => enemy.moveTo(progress));
    towers.forEach((tower) => tower.attack(enemies));
  }

  _loop() {
    if (lastRender === 0) {
      lastRender = Date.now();
    }

    this.draw();

    if (this._pause) {
      lastRender = Date.now();
      window.requestAnimationFrame(this._loop.bind(this));
      return;
    }

    const progress = Date.now() - lastRender;

    if (progress > 1000 / 45) {
      this.update(progress);
      lastRender = Date.now();
    }

    if (!stop) {
      window.requestAnimationFrame(this._loop.bind(this));
    }
  }
}

module.exports = Game;
