class GameEvent {
  constructor(name) {
    this.name = name;
    this._subscribers = new Map();
  }

  add(fn) {
    const contains = this._subscribers.get(fn);

    if (contains) {
      const err = new Error(`Event ${this.name}` +
        'already contains that function');

      err.name = 'Event Error';
      throw err;
    }

    this._subscribers.set(fn, fn);
  }

  contains(fn) {
    return !!this._subscribers.get(fn);
  }

  remove(fn) {
    if (!this.contains(fn)) {
      return;
    }

    this._subscribers.delete(fn);
  }

  removeAll() {
    this._subscribers.clear();
  }

  notifyAll(...args) {
    this._subscribers.forEach((fn) => fn(...args));
  }
};

module.exports = GameEvent;
