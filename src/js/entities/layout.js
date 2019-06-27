// Breadth-first search in set
function bfs(set, fn) {
  const queue = [];
  const visitedNodes = [];
  set.forEach((firstNode) => {
    queue.push(firstNode);
    while (queue.length !== 0) {
      const node = queue.shift();
      visitedNodes.push(node);
      node._childs.forEach((child) => queue.push(child));
      if (fn) {
        fn(node);
      }
    }
  });
};


class Layout {
  constructor(canvas) {
    if (typeof canvas === 'undefined') {
      const err = new Error('Canvas is undefined');
      err.name = 'Invalid Argument';
      throw err;
    }

    this._map = new Set();
    this._menu = new Set();
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
    bfs(this._menu, (ent) => ent.draw(this._ctx));
  }

  addMenuEntity(entity) {
    this._menu.add(entity);
  }

  addMapEntity(entity) {
    this._map.add(entity);
  }
}

module.exports = Layout;
