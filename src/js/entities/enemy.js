const Entity = require('./entity');
const GameEvent = require('../lib/events');

class Enemy extends Entity {
  constructor(opts = {}) {
    super(opts);

    this._health = opts.health || 100;
    this._speed = opts.speed || 2;
    this._path = [];

    this._events.set('onDeath', new GameEvent('onDeath'));
    this._events.set('onTarget', new GameEvent('onTarget'));
  }

  get health() {
    return this._health;
  }

  set health(value) {
    this._health = value;
    if (this._health <= 0) {
      this._fireEvent('onDeath', this);
    }
  }

  setPath(path) {
    this._path = [];
    path.forEach((point) => {
      this._path.push(point);
    });
  }

  moveTo(progress) {
    const delta = 15;
    const pos = this.position;
    const path = this._path[0];

    if (!path) {
      this._fireEvent('onTarget', this);
      return;
    }

    if ((pos.x < path.x + delta && pos.x > path.x - delta) &&
        (pos.y < path.y + delta && pos.y > path.y - delta)) {
      this._path.shift();
      return;
    }

    const k = Math.abs((pos.x - path.x) / (pos.y - path.y));
    const vy = Math.sqrt(this._speed ** 2 / (1 + k **2));
    const vx = vy * k;

    const signX = Math.sign(path.x - pos.x);
    const signY = Math.sign(path.y - pos.y);

    pos.x += signX * vx;
    pos.y += signY * vy;
  }

  kill() {
    this.health = 0;
  }

  applyDamage(damage) {
    this.health -= damage;
  }
}

module.exports = Enemy;
