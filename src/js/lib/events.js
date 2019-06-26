let subscribers;


class GameEvent {
  constructor(name) {
    this.name = name;
    subscribers = new Map();
  }

  add(fn) {
    const contains = subscribers.get(fn);

    if (contains) {
      const err = new Error(`Event ${this.name}` +
        'already contains that function');

      err.name = 'Event Error';
      throw err;
    }

    subscribers.set(fn, fn);
  }

  contains(fn) {
    return !!subscribers.get(fn);
  }

  remove(fn) {
    if (!this.contains(fn)) {
      return;
    }

    subscribers.delete(fn);
  }

  removeAll() {
    subscribers.clear();
  }

  notifyAll(...args) {
    subscribers.forEach((fn) => fn(...args));
  }
}


module.exports = GameEvent;
