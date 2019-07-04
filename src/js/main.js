const resources = require('./lib/resources');

resources.onReady(() => {
  const Game = require('./game');
  new Game().start();
}
);
resources.load();
