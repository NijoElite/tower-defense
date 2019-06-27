const Game = require('./game');
const resources = require('./lib/resources');

resources.onReady(() => new Game().start());
resources.load();
