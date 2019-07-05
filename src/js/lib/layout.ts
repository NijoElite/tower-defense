import {Enemy} from '../entities/enemy';
import {Tower} from '../entities/tower';
import {GameMap} from '../entities/map';
import {Entity} from '../entities/entity';

// Breadth-first search in entity
function bfs(ent: Entity, fn: Function): void {
    if (!ent) {
        return;
    }

    const queue = [];
    const visitedNodes = [];
    queue.push(ent);
    while (queue.length !== 0) {
        const node = queue.shift();
        visitedNodes.push(node);
        node.childs.forEach((child: Entity): void => {queue.push(child)});
        if (fn) {
            fn(node);
        }
    };
};


class Layout {
    private _map: GameMap;
    private _popup: Entity;
    private _container: Entity;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    public constructor(canvas: HTMLCanvasElement, map: GameMap) {
        this._map = map;
        this._popup = new Entity();
        this._container = new Entity();

        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');

        this._canvas.addEventListener('click', this._onCanvasClick.bind(this));
    }

    private _onCanvasClick(e): void {
        const clickedEntity = this._getClickedEntity(e);

        if (!clickedEntity) return;

        clickedEntity._fireEvent('onClick', clickedEntity, e);
    }

    private _getClickedEntity(e): Entity {
        const isClicked = (ent: Entity, x: number, y: number): boolean => {
            return ent.coordsInbound(x, y);
        };

        const bfsFinder = (ent: Entity): Entity => {
            let result = null;
            bfs(ent, (node: Entity): void => {
                if (isClicked(node, e.clientX, e.clientY)) {
                    result = node;
                }
            });
            return result;
        };

        const clickedEnt = bfsFinder(this._popup) ||
                       bfsFinder(this._container) ||
                       bfsFinder(this._map);

        return clickedEnt;
    }

    public draw(): void {
        this._ctx.clearRect(0, 0, 2000, 2000);

        const drawEnt = (ent: Entity): void => ent.draw(this._ctx);
        bfs(this._map, drawEnt);
        bfs(this._container, drawEnt);
        bfs(this._popup, drawEnt);
    }

    public addEntity(ent: Entity): void {
        this._map.appendChild(ent);
    }

    public addMenuItem(item: Entity): void {
        this._container.appendChild(item);
    }

    public getEnemies(): Enemy[] {
        const result = [];

        bfs(this._map, (ent: Entity): void => {
            if (ent instanceof Enemy) {
                result.push(ent);
            }
        });

        return result;
    }

    public removeEntity(ent): void {
        this._map.removeChild(ent);
    }

    public removeMenuItem(item): void {
        this._container.removeChild(item);
    }

    public showPopup(ent): void {
        if (ent === this._popup) {
            return this.closePopup();
        }

        this._popup = ent;
    }

    public isPopupVisible(): boolean {
        return !!this._popup;
    }

    public closePopup(): void {
        this._popup = null;
    }

    public getTowers(): Tower[] {
        const result: Tower[] = [];

        bfs(this._map, (ent: Entity): void => {
            if (ent instanceof Tower) {
                result.push(ent);
            }
        });

        return result;
    }
}

export default Layout;