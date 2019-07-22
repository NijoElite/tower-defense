import { GameMap } from "../entities/map";
import { UIElement } from "./uiElement";
import { Popup } from "../entities/popup";

interface FrameOptions {
    staticCanvas: HTMLCanvasElement;
    dynamicCanvas: HTMLCanvasElement;
    map: GameMap;
}

// Breadth-first search in UIElement
function bfs(el: UIElement, fn: Function): void {
    if (!el) {
        return;
    }

    const queue = [];
    const visitedNodes = [];
    queue.push(el);
    while (queue.length !== 0) {
        const node = queue.shift();
        visitedNodes.push(node);
        node.childs.forEach((child: UIElement): void => {queue.push(child)});
        if (fn) {
            fn(node);
        }
    };
};

class Frame {
    private _foregroundCtx: CanvasRenderingContext2D;
    private _backgroundCtx: CanvasRenderingContext2D;

    private _foregroundContainer: UIElement = new UIElement();
    private _backgroundContainer: UIElement = new UIElement();

    private _foregroundCanvas: HTMLCanvasElement;
    private _backgroundCanvas: HTMLCanvasElement;

    private _popup: Popup = null;

    public set popup(newPopup: Popup) {
        if (this._popup) {
            this._foregroundContainer.removeChild(this._popup);
        }
        if (newPopup) {
            this._foregroundContainer.appendChild(newPopup);
        }

        this._popup = newPopup;
    }

    public constructor(foreground: HTMLCanvasElement, background: HTMLCanvasElement) {
        this._foregroundCanvas = foreground;
        this._backgroundCanvas = background;
        
        this._foregroundCtx = this._foregroundCanvas.getContext('2d');
        this._backgroundCtx = this._backgroundCanvas.getContext('2d');

        this._foregroundCanvas.addEventListener('click', this._onClick.bind(this));
    }

    private _onClick(event: MouseEvent): void {
        const isClicked = (el: UIElement, x: number, y: number): boolean => {
            return el.coordsInbound(x, y);
        };

        const bfsFinder = (el: UIElement): UIElement => {
            let result = null;
            bfs(el, (node: UIElement): void => {
                if (isClicked(node, event.pageX, event.pageY)) {
                    result = node;
                }
            });
            return result;
        };

        const clickedEnt = bfsFinder(this._foregroundContainer) ||
                       bfsFinder(this._backgroundContainer);

        clickedEnt._fireEvent('onClick', clickedEnt);
    }

    public draw(updateBackground: boolean = false): void {
        const clearAndDraw = (el: UIElement, ctx: CanvasRenderingContext2D): void => {
            ctx.clearRect(0, 0, 2000, 2000);
            const drawEl = (el: UIElement): void => el.draw(ctx);
            bfs(el, drawEl);
        };

        clearAndDraw(this._foregroundContainer, this._foregroundCtx);

        if (updateBackground) {
            clearAndDraw(this._backgroundContainer, this._backgroundCtx);
        }
    }

    public addForeground(el: UIElement): void {
        this._foregroundContainer.appendChild(el);
    }

    public addBackground(el: UIElement): void {
        this._backgroundContainer.appendChild(el);
    }

    public removeBackground(el: UIElement): void {
        this._backgroundContainer.removeChild(el);
    }

    public removeForeground(el: UIElement): void {
        this._foregroundContainer.removeChild(el);
    }
}

export {Frame, FrameOptions};