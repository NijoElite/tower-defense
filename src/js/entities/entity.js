const GameEvent = require('../lib/events');
const SpriteSet = require('../lib/sprite-set');

class Entity {
  constructor(opts = {}) {
    this.position = opts.position || {x: 0, y: 0};

    this.centered = opts.centered || false;
    this.relative = opts.relative || false;
    this.size = opts.size || null;

    this._sprites = new SpriteSet(opts.fps || 30, opts.names);
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
    child.parent = this;
    this._childs.add(child);
  }

  removeChild(child) {
    child.parent = null;
    this._childs.delete(child);
  }

  coordsInbound(x, y) {
    const frame = this._sprites.getCurrentFrame();

    if (!frame) {
      return false;
    }

    let w = frame.width;
    let h = frame.height;
    let xInbound = false;
    let yInbound = false;

    if (this.size) {
      w = this.size.width;
      h = this.size.height;
    }

    let pos = this.position;
    if (this.relative && this.parent) {
      pos = {};
      pos.x = this.parent.position.x + this.position.x;
      pos.y = this.parent.position.y + this.position.y;
    }

    if (this.centered) {
      xInbound = (x > pos.x - w / 2) &&
                 (x < pos.x + w / 2);

      yInbound = (y > pos.y - h / 2) &&
                 (y < pos.y + h / 2);
    } else {
      xInbound = (x > pos.x && x < pos.x + w);
      yInbound = (y > pos.y && y < pos.y + h);
    }

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
    let w = img.width;
    let h = img.height;
    let x = this.position.x;
    let y = this.position.y;

    if (this.size) {
      w = this.size.width;
      h = this.size.height;
    }

    if (this.centered) {
      dx = -w / 2;
      dy = -h / 2;
    }

    if (this.relative && this.parent) {
      x = this.parent.position.x + this.position.x;
      y = this.parent.position.y + this.position.y;
    }

    ctx.drawImage(img, x + dx, y + dy, w, h);
  }
}

module.exports = Entity;
