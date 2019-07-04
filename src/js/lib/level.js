const Place = require('../entities/place');

class Level {
  constructor(spawn, paths, places, opts) {
    this.spawn = spawn;
    this.paths = paths;

    this.places = [];
    places.forEach((place) => {
      this.places.push(new Place({position: {x: place.x, y: place.y}}));
    });
  }
}

module.exports = Level;
