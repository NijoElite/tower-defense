const Tower = require('./entities/tower');
const Enemy = require('./entities/enemy');
const GameMap = require('./entities/map');
const Layout = require('./entities/layout');

const canvas = document.getElementById('game-canvas');

let lastRender = 0;
let stop = false;

class Game {
  constructor() {
    this.towers = [];
    this.enemies = [];

    this.layout = new Layout(canvas);

    this.map = new GameMap({
      names: ['map.jpg'],
    });
    this.layout.addMapEntity(this.map);
    this.map.on('onClick', () => {console.log('Map Clicked')});
    this.wave = 0;
  }

  draw() {
    this.layout.draw();
  }

  start() {
    stop = false;
    this.fake();
    window.requestAnimationFrame(() => this._loop());
  }

  fake() {
    const en2 = new Enemy({
      health: 1000,
      position: {
        x: 100,
        y: 200,
      },
      names: ['29.png', '30.png', '31.png', '32.png', '33.png', '34.png'],
    });

    en2.on('onClick', () => {
      console.log('click');
    });

    this.map.appendChild(en2);
  }

  stop() {
    stop = true;
  }

  update(progress) {

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
