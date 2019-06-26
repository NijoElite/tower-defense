const Entity = require('./entity');
const GameEvent = require('../lib/events');

class Enemy extends Entity {
  constructor(opts = []) {
    super(opts);

    if (typeof opts.pos === 'undefined') {
      opts.pos = {};
    }

    this._health = opts.health || 100;
    this._speed = opts.speed || 10;

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
    console.log('move My Health is ' + this._health);
  }

  kill() {
    this.health = 0;
  }

  applyDamage(damage) {
    this.health -= damage;
  }
}

module.exports = Enemy;
