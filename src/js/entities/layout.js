const Enemy = require('../entities/enemy');
const Tower = require('../entities/tower');
const GameMap = require('../entities/map');
const Entity = require('../entities/entity');

// Breadth-first search in entity
function bfs(ent, fn) {
  const queue = [];
  const visitedNodes = [];
  queue.push(ent);
  while (queue.length !== 0) {
    const node = queue.shift();
    visitedNodes.push(node);
    node.childs.forEach((child) => queue.push(child));
    if (fn) {
      fn(node);
    }
  };
};


class Layout {
  constructor(canvas, map) {
    if (typeof canvas === 'undefined') {
      const err = new Error('Canvas is undefined');
      err.name = 'Invalid Argument';
      throw err;
    }

    if (!(map instanceof GameMap)) {
      const err = new Error('Map is not instance of GameMap');
      err.name = 'Invalid Argument';
      throw err;
    }

    this._map = map;

    this._container = new Entity();

    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');

    this._canvas.addEventListener('click', this._onCanvasClick.bind(this));
  }

  _onCanvasClick(e) {
    const clickedEntity = this._getClickedEntity(e);

    if (!clickedEntity) return;

    clickedEntity._fireEvent('onClick', clickedEntity, e);
  }

  _getClickedEntity(e) {
    const isClicked = (ent, x, y) => {
      return ent.coordsInbound(x, y);
    };

    const bfsFinder = (set) => {
      let result = null;
      bfs(set, (node) => {
        if (isClicked(node, e.clientX, e.clientY)) {
          result = node;
        }
      });
      return result;
    };

    const clickedEnt = bfsFinder(this._menu) || bfsFinder(this._map);

    return clickedEnt;
  }

  draw() {
    this._ctx.clearRect(0, 0, 2000, 2000);
    bfs(this._map, (ent) => ent.draw(this._ctx));
    bfs(this._container, (ent) => ent.draw(this._ctx));
  }

  addEntity(enemy) {
    this._map.appendChild(enemy);
  }

  addMenuItem(item) {
    this._container.appendChild(item);
  }

  getEnemies() {
    const result = [];

    bfs(this._map, (ent) => {
      if (ent instanceof Enemy) {
        result.push(ent);
      }
    });

    return result;
  }

  removeEntity(ent) {
    this._map.removeChild(ent);
  }

  removeMenuItem(item) {
    this._container.removeChild(item);
  }

  getTowers() {
    const result = [];

    bfs(this._map, (ent) => {
      if (ent instanceof Tower) {
        result.push(ent);
      }
    });

    return result;
  }
}

module.exports = Layout;
