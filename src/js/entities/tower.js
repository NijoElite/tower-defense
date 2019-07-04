const Entity = require('./entity');

class Tower extends Entity {
  constructor(opts = {}) {
    super(opts);

    this._damage = opts.damage || 50;
    this._range = opts.range || 50;
    this._lastShot = Number.MIN_SAFE_INTEGER;

    this._cooldown = opts.cooldown || 500;
  }

  _getClosestTarget(targets) {
    let closest = null;
    let minDistance = Number.MAX_SAFE_INTEGER;

    targets.forEach((target) => {
      if (typeof closest === 'null') {
        return target = closest;
      }

      const distance = this._getDistanceToTarget(target);
      if (distance < minDistance) {
        closest = target;
        minDistance = distance;
      }
    });

    return closest;
  }

  _getDistanceToTarget(target) {
    const ePos = target.position;
    const tPos = this.position;

    const dx = Math.abs(tPos.x - ePos.x);
    const dy = Math.abs(tPos.y - ePos.y);

    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  attack(targets) {
    const timestamp = Date.now();
    if (timestamp - this._lastShot < this._cooldown ) {
      return;
    }

    this._lastShot = timestamp;
    const enemyTarget = this._getClosestTarget(targets);

    if (!enemyTarget) {
      return;
    }

    enemyTarget.applyDamage(this._damage);
  }
}

module.exports = Tower;
