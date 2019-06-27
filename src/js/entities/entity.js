const GameEvent = require('../lib/events');
const SpriteSet = require('../lib/sprite-set');

class Entity {
  constructor(opts = {}) {
    this.position = opts.position || {x: 0, y: 0};

    this.centered = opts.centered || false;

    this._sprites = new SpriteSet(5, opts.names);
    this._events = new Map();

    this._childs = new Set();
    this.parent = null;

    // onHover(this)
    // this._events.set('onHover', new GameEvent('onHover'));

    // onClick(this)
    this._events.set('onClick', new GameEvent('onClick'));
    // this._canvas.addEventListener('click', this._onClick.bind(this));
  }

  get childs() {
    return this._childs;
  }

  appendChild(child) {
    child._parent = this;
    this._childs.add(child);
  }

  removeChild(child) {
    child._parent = null;
    this._childs.delete(child);
  }

  coordsInbound(x, y) {
    const frame = this._sprites.getCurrentFrame();
    const pos = this.position;
    const xInbound = (x > pos.x - frame.width / 2) &&
                     (x < pos.x + frame.width / 2);

    const yInbound = (y > pos.y - frame.height / 2) &&
                     (y < pos.y + frame.height / 2);
    return xInbound && yInbound;
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
    const img = this._sprites.getNextFrame();

    if (typeof img === 'undefined') {
      return;
    }

    let dx = 0;
    let dy = 0;
    if (this.centered) {
      dx = -img.width / 2;
      dy = -img.height / 2;
    }

    ctx.drawImage(img, this.position.x + dx, this.position.y + dy);
  }
}

module.exports = Entity;
