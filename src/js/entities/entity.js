class Entity {
  constructor(opts = []) {
    this.frames = opts.frames || [];
    this.fps = opts.fps || 30;
    this.position = opts.position || {x: 0, y: 0};

    this._events = new Map();
    this._timestamps = {
      lastShot: 0,
      lastAnimate: 0,
    };
  }

  on(eventName, cb) {
    const event = this._events.get(eventName);

    if (typeof event === 'undefined') {
      const err = new Error(`${eventName} does not exist`);
      err.name = 'Invalid Argument';
      throw err;
    }

    if (typeof cb !== 'function') {
      const err = new Error('Callback must be a function');
      err.name = 'Type Error';
      throw err;
    }

    event.add(cb);
  }

  _fireEvent(eventName, ...args) {
    const event = this._events.get(eventName);

    if (typeof event === 'undefined') {
      const err = new Error(`${eventName} does not exist`);
      err.name = 'Invalid Argument';
      throw err;
    }

    event.notifyAll(...args);
  }

  draw(ctx) {
    ctx.drawRect(thix.position.x, this.position.y, 5, 5);
  }

  update(progress) {
    const coolDown = 5000;
    const animationTime = 1000 / 35;

    const ts = this._timestamps;

    if (Date.now() - ts.lastShot >= coolDown) {
      this._fireEvent('shoot', this);
      ts.lastShot = Date.now();
    }
  }
}

module.exports = Entity;
