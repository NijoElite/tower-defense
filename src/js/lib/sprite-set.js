const resources = require('./resources');

class SpriteSet {
  constructor(fps = 30, names = []) {
    this._frames = resources.getResources(names);
    this._fps = fps;
    this._frameIndex = 0;
    this._lastUpdate = 0;
  }

  getCurrentFrame() {
    return this._frames[this._frameIndex];
  }

  getNextFrame() {
    const now = Date.now();
    const frameTime = 1000 / this._fps;

    if (this._lastUpdate === 0) {
      this._lastUpdate = now;
    }

    if (now - this._lastUpdate < frameTime) {
      return this.getCurrentFrame();
    }

    this._lastUpdate = now;
    this._frameIndex = (this._frameIndex + 1) % this._frames.length;

    return this._frames[this._frameIndex];
  }
}

module.exports = SpriteSet;
