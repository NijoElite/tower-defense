const Entity = require('./entity');

const defaultSprites = ['place.png'];

class Place extends Entity {
  constructor(opts = {}) {
    opts.names = defaultSprites;
    opts.size = {width: 35, height: 35};
    super(opts);
  }
}

module.exports = Place;
