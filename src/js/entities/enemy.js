const Entity = require('./entity');
const GameEvent = require('../lib/events');

const examplePath =
[
  {
    'x': 205,
    'y': 51,
  },
  {
    'x': 204,
    'y': 123,
  },
  {
    'x': 204,
    'y': 154,
  },
  {
    'x': 205,
    'y': 198,
  },
  {
    'x': 216,
    'y': 233,
  },
  {
    'x': 273,
    'y': 267,
  },
  {
    'x': 346,
    'y': 290,
  },
  {
    'x': 392,
    'y': 300,
  },
  {
    'x': 425,
    'y': 248,
  },
  {
    'x': 428,
    'y': 182,
  },
  {
    'x': 485,
    'y': 155,
  },
  {
    'x': 589,
    'y': 160,
  },
  {
    'x': 677,
    'y': 166,
  },
  {
    'x': 725,
    'y': 174,
  },
  {
    'x': 735,
    'y': 218,
  },
  {
    'x': 731,
    'y': 271,
  },
  {
    'x': 725,
    'y': 324,
  },
  {
    'x': 712,
    'y': 352,
  },
  {
    'x': 638,
    'y': 360,
  },
  {
    'x': 530,
    'y': 375,
  },
  {
    'x': 498,
    'y': 392,
  },
  {
    'x': 490,
    'y': 436,
  },
  {
    'x': 487,
    'y': 520,
  },
  {
    'x': 488,
    'y': 572,
  },
  {
    'x': 492,
    'y': 619,
  },
  {
    'x': 490,
    'y': 688,
  },
  {
    'x': 495,
    'y': 772,
  },
  {
    'x': 509,
    'y': 787,
  },
  {
    'x': 605,
    'y': 809,
  },
  {
    'x': 783,
    'y': 820,
  },
  {
    'x': 932,
    'y': 829,
  },
  {
    'x': 1038,
    'y': 828,
  },
  {
    'x': 1131,
    'y': 818,
  },
  {
    'x': 1200,
    'y': 843,
  },
  {
    'x': 1236,
    'y': 894,
  },
];


class Enemy extends Entity {
  constructor(opts = {}) {
    super(opts);

    this._health = opts.health || 100;
    this._speed = opts.speed || 2;
    this._path = examplePath;

    this._events.set('onDeath', new GameEvent('onDeath'));
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

  moveTo(progress, target) {
    const delta = 15;
    const pos = this.position;
    const path = this._path[0];

    if (!path) return;

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
