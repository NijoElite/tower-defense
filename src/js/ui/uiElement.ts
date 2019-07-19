import GameEvent from '../lib/events';
import SpriteSet from '../lib/sprite-set';
import {Point, Size} from '../lib/interfaces';


interface UIElementOptions {
    position: Point;
    names?: string[];
    centered?: boolean;
    relative?: boolean;
    fps?: number;
    size?: Size;
}

class UIElement {
    public centered: boolean;
    public relative: boolean;
    public size: Size;
    public position: Point;
    public parent: UIElement;

    protected _sprites: SpriteSet;
    protected _events: Map<string, GameEvent>;
    protected _childs: Set<UIElement>;


    public constructor(opts: UIElementOptions = {position: {x:0, y:0}}) {
        this.position = opts.position;

        this.centered = opts.centered || false;
        this.relative = opts.relative || false;
        this.size = opts.size || null;

        this._sprites = new SpriteSet(opts.fps || 30, opts.names);
        this._events = new Map();

        this._childs = new Set();
        this.parent = null;

        /* Events */
        // onClick
        this._events.set('onClick', new GameEvent('onClick'));
    }

    public get childs(): Set<UIElement> {
        return this._childs;
    }

    public appendChild(child: UIElement): void {
        child.parent = this;
        this._childs.add(child);
    }

    public removeChild(child: UIElement): void {
        child.parent = null;
        this._childs.delete(child);
    }

    public coordsInbound(x: number, y: number): boolean {
        const frame = this._sprites.getCurrentFrame();

        if (!frame) {
            return false;
        }

        let w = frame.width;
        let h = frame.height;
        let xInbound = false;
        let yInbound = false;

        if (this.size) {
            w = this.size.width;
            h = this.size.height;
        }

        let pos = this.position;
        if (this.relative && this.parent) {
            pos = {x: 0, y: 0};
            pos.x = this.parent.position.x + this.position.x;
            pos.y = this.parent.position.y + this.position.y;
        }

        if (this.centered) {
            xInbound = (x > pos.x - w / 2) &&
                 (x < pos.x + w / 2);

            yInbound = (y > pos.y - h / 2) &&
                 (y < pos.y + h / 2);
        } else {
            xInbound = (x > pos.x && x < pos.x + w);
            yInbound = (y > pos.y && y < pos.y + h);
        }

        return xInbound && yInbound;
    }

    public on(eventName: string, cb: Function): void {
        const event = this._events.get(eventName);
        event.add(cb);
    }

    public getAbsolutePosition(): Point {
        let result: Point;
        if (!this.parent) {
            result = {
                x: this.position.x,
                y: this.position.y,
            };
        } else {
            result = {
                x: this.position.x + this.parent.position.x,
                y: this.position.y + this.parent.position.y,
            };
        }
        return result;
    }

    public _fireEvent(eventName: string, ...args): void {
        const event = this._events.get(eventName);

        event.notifyAll(...args);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const img = this._sprites.getNextFrame();

        if (!img) {
            return;
        }

        let dx = 0;
        let dy = 0;
        let w = img.width;
        let h = img.height;
        let x = this.position.x;
        let y = this.position.y;

        if (this.size) {
            w = this.size.width;
            h = this.size.height;
        }

        if (this.centered) {
            dx = -w / 2;
            dy = -h / 2;
        }

        if (this.relative && this.parent) {
            x = this.parent.position.x + this.position.x;
            y = this.parent.position.y + this.position.y;
        }

        ctx.drawImage(img, x + dx, y + dy, w, h);
    }
}


export  {UIElement, UIElementOptions};