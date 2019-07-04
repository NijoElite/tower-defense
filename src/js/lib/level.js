const Place = require('../entities/place');
const GameMap = require('../entities/map');

class Level {
  constructor(spawn, paths, places, map) {
    this.spawn = spawn;
    this.paths = paths;

    this.health = 0;
    this.money = 0;
    this.wave = 0;

    this.map = new GameMap({
      names: map,
      position: {
        x: 0,
        y: 0,
      },
      size: {
        width: 1600,
        height: 900,
      },
    });

    this.places = [];
    places.forEach((place) => {
      this.places.push(new Place({position: {x: place.x, y: place.y}}));
    });
  }
}

module.exports = Level;
