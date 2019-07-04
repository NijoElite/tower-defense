const Level = require('../lib/level');
const enemyFactory = require('../helpers/enemy-factory');

const SPAWN = {x: 190, y: -30};
const PLACES = [
  {x: 475, y: 208},
  {x: 653, y: 208},
  {x: 361, y: 352},
  {x: 415, y: 580},
  {x: 415, y: 700},
];
const PATHS = [[
  {
    'x': 246,
    'y': 25,
  },
  {
    'x': 247,
    'y': 190,
  },
  {
    'x': 318,
    'y': 273,
  },
  {
    'x': 351,
    'y': 285,
  },
  {
    'x': 376,
    'y': 288,
  },
  {
    'x': 394,
    'y': 288,
  },
  {
    'x': 393,
    'y': 147,
  },
  {
    'x': 752,
    'y': 145,
  },
  {
    'x': 754,
    'y': 364,
  },
  {
    'x': 511,
    'y': 396,
  },
  {
    'x': 514,
    'y': 795,
  },
  {
    'x': 1165,
    'y': 803,
  },
  {
    'x': 1280,
    'y': 896,
  },
], [
  {
    'x': 146,
    'y': 22,
  },
  {
    'x': 172,
    'y': 249,
  },
  {
    'x': 228,
    'y': 311,
  },
  {
    'x': 430,
    'y': 319,
  },
  {
    'x': 433,
    'y': 174,
  },
  {
    'x': 717,
    'y': 181,
  },
  {
    'x': 717,
    'y': 338,
  },
  {
    'x': 474,
    'y': 358,
  },
  {
    'x': 476,
    'y': 814,
  },
  {
    'x': 1087,
    'y': 822,
  },
  {
    'x': 1127,
    'y': 823,
  },
  {
    'x': 1201,
    'y': 893,
  },
], [
  {
    'x': 194,
    'y': 26,
  },
  {
    'x': 209,
    'y': 224,
  },
  {
    'x': 264,
    'y': 277,
  },
  {
    'x': 344,
    'y': 301,
  },
  {
    'x': 417,
    'y': 295,
  },
  {
    'x': 413,
    'y': 164,
  },
  {
    'x': 737,
    'y': 166,
  },
  {
    'x': 733,
    'y': 346,
  },
  {
    'x': 490,
    'y': 379,
  },
  {
    'x': 500,
    'y': 803,
  },
  {
    'x': 1142,
    'y': 818,
  },
  {
    'x': 1228,
    'y': 891,
  },
]];


const level = new Level(SPAWN, PATHS, PLACES);


level.generateEnemies = function(wave, onDeath, onFinished) {
  const count = wave * 5 + 20;
  const enemies = [];

  for (let i = 0; i < count; i++) {
    const xOffset = Math.random() * 50 - 25;
    const yOffset = -Math.random() * 40 * i;

    const spawn = {x: this.spawn.x + xOffset, y: this.spawn.y + yOffset};
    const enemy = enemyFactory.random(spawn);
    const path = this.paths[Math.trunc(Math.random() * this.paths.length)];

    enemy.setPath(path);
    enemy.on('onTarget', onFinished);
    enemy.on('onDeath', onDeath);

    enemies.push(enemy);
  }

  return enemies;
};

module.exports = level;
