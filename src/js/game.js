const Tower = require('./entities/tower');
const Enemy = require('./entities/enemy');
const GameMap = require('./entities/map');
const Layout = require('./entities/layout');
const paths = require('./paths');
const enemyFactory = require('./helpers/enemy-factory');

const canvas = document.getElementById('game-canvas');

let lastRender = 0;
let stop = false;

const SPAWN_POINT = {x: 190, y: -30};

class Game {
  constructor() {
    this.towers = [];
    this.enemies = [];

    this.layout = new Layout(canvas);

    this.map = new GameMap({
      names: ['map.jpg'],
      size: {
        width: 1600,
        height: 900,
      },
    });

    this.layout.addMapEntity(this.map);
    this.wave = 0;
    this.money = 5000;
    this.health = 5;
  }

  draw() {
    this.layout.draw();
  }

  start() {
    stop = false;
    this.generateEnemies();
    this.fake();
    window.requestAnimationFrame(() => this._loop());
  }


  // 490, 233
  fake() {
    const tower = new Tower({
      names: ['13.png'],
      position: {
        x: 490,
        y: 233,
      },
    });

    this.map.appendChild(tower);
    this.towers.push(tower);
  }

  stop() {
    stop = true;
  }

  _onEnemyFinished(enemy) {
    this._removeEnemy(enemy);
    this.checkAliveEnemies();
  }

  checkAliveEnemies() {
    if (this.enemies.length === 0) {
      setTimeout(() => this.generateEnemies(), 3000);
    }
  }

  _removeEnemy(enemy) {
    this.map.removeChild(enemy);
    this.enemies.splice(this.enemies.indexOf(enemy), 1);
  }

  _onEnemyDeath(enemy) {
    this.money += 50;

    this._removeEnemy(enemy);
    this.checkAliveEnemies();
  }

  generateEnemies() {
    const count = this.wave * 5 + 20;

    for (let i = 0; i < count; i++) {
      const xOffset = Math.random() * 50 - 25;
      const yOffset = -Math.random() * 40 * i;

      const spawn = {x: SPAWN_POINT.x + xOffset, y: SPAWN_POINT.y + yOffset};
      const enemy = enemyFactory.random(spawn);
      const path = paths[Math.trunc(Math.random() * paths.length)];

      enemy.setPath(path);
      enemy.on('onTarget', this._onEnemyFinished.bind(this));
      enemy.on('onDeath', this._onEnemyDeath.bind(this));

      this.enemies.push(enemy);
      this.map.appendChild(enemy);
    }
  }

  update(progress) {
    this.enemies.forEach((enemy) => enemy.moveTo(progress));
    this.towers.forEach((tower) => tower.attack(this.enemies));
  }

  _loop() {
    if (lastRender === 0) {
      lastRender = Date.now();
    }

    const progress = Date.now() - lastRender;

    this.update(progress);
    this.draw();

    lastRender = Date.now();

    if (!stop) {
      window.requestAnimationFrame(this._loop.bind(this));
    }
  }
}

module.exports = Game;
