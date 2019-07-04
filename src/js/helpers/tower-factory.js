const Tower = require('../entities/tower');


function fireTower(position) {
  const tower = new Tower({
    names: ['12.png'],
    damage: 5,
    range: 100,
    cooldown: 50,
    size: {width: 36, height: 50},
    position: position,
    centered: true,
  });
  return tower;
}

function stoneTower(position) {
  const tower = new Tower({
    names: ['6.png'],
    damage: 150,
    range: 300,
    cooldown: 3000,
    size: {width: 36, height: 50},
    position: position,
    centered: true,
  });
  return tower;
}

module.exports = {fireTower, stoneTower};
