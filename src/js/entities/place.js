const Entity = require('./entity');

const defaultSprites = ['place.png'];

class Place extends Entity {
  constructor(opts = {}) {
    opts.names = defaultSprites;
    super(opts);
  }
}

module.exports = Place;
