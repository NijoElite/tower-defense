const GameEvent = require('../lib/events');

class Entity {
  constructor(opts = []) {
    if (typeof opts.canvas === 'undefined') {
      const err = new Error(`canvas is undefined`);
      err.name = 'Invalid Argument';
      throw err;
    }

    this._canvas = opts.canvas;
    this._ctx = this._canvas.getContext('2d');

    this.frames = opts.frames || [];
    this.fps = opts.fps || 30;
    this.position = opts.position || {x: 0, y: 0};
    this.size = opts.size || {width: 0, height: 0};

    this._events = new Map();
    this._timestamps = {
      lastShot: 0,
      lastAnimate: 0,
    };

    // onHover(this)
    this._events.set('onHover', new GameEvent('onHover'));
    // onClick(this, )
    this._events.set('onClick', new GameEvent('onClick'));

    this._canvas.addEventListener('click', this._onClick.bind(this));
    // this._canvas.addEventListener('click', this._onHover.bind(this));
  }

  _onClick(e) {
    const x = e.clientX;
    const y = e.clientY;

    const xInbound = (x > this.position.x) &&
                     (x < this.position.x + this.size.width);

    const yInbound = y > this.position.y &&
                     y < this.position.y + this.size.height;

    if (xInbound && yInbound) {
      console.log(this);
      this._fireEvent('onClick', this, e);
    }
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

  draw() {
    this._ctx.fillRect(this.position.x, this.position.y,
        this.size.width, this.size.height);
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
