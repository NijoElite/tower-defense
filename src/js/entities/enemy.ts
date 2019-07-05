import {Entity, EntityOptions} from './entity';
import GameEvent from '../lib/events';
import {Point} from '../lib/interfaces';

interface EnemyOptions extends EntityOptions {
    health?: number;
    speed?: number; 
}

class Enemy extends Entity {
    private _health: number;
    private _maxHealth: number;
    private _speed: number;
    private _path: Point[];

    public constructor(opts: EnemyOptions) {
        super(opts);

        this._health = opts.health || 100;
        this._maxHealth = this._health;
        this._speed = opts.speed || 2;
        this._path = [];

        this._events.set('onDeath', new GameEvent('onDeath'));
        this._events.set('onTarget', new GameEvent('onTarget'));
    }

    public get health(): number {
        return this._health;
    }

    public set health(value) {
        this._health = value;
        if (this._health <= 0) {
            this._fireEvent('onDeath', this);
        }
    }

    public setPath(path: Point[]): void {
        this._path = [];
        path.forEach((p): void => {
            this._path.push({x: p.x, y: p.y});
        })
    }

    public moveTo(progress: number): void {
        const delta = 15;
        const pos = this.position;
        const path = this._path[0];

        if (!path) {
            this._fireEvent('onTarget', this);
            return;
        }

        if ((pos.x < path.x + delta && pos.x > path.x - delta) &&
        (pos.y < path.y + delta && pos.y > path.y - delta)) {
            this._path.shift();
            return;
        }

        const k = Math.abs((pos.x - path.x) / (pos.y - path.y));
        const vy = Math.sqrt(this._speed ** 2 / (1 + k **2));
        const vx = vy * k;

        const signX = Math.sign(path.x - pos.x);
        const signY = Math.sign(path.y - pos.y);


        pos.x += signX * vx;
        pos.y += signY * vy;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);

        const img = this._sprites.getCurrentFrame();

        if (!img) {
            return;
        }

        let dx = 0;
        let dy = -3;
        let w = img.width;
        let h = img.height;

        if (this.size) {
            w = this.size.width;
            h = this.size.height;
        }
        if (this.centered) {
            dx += -w / 2;
            dy += -h / 2;
        }

        const pos = this.position;
        let hp = this.health / this._maxHealth;
        hp = hp < 0 ? 0 : hp;
        hp = hp > 1 ? 1 : hp;

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(pos.x + dx, pos.y + dy, w, 3); // bg of health bar

        ctx.fillStyle = '#00ff00';
        ctx.fillRect(pos.x + dx, pos.y + dy, hp * w, 3);
    }

    public kill(): void {
        this.health = 0;
    }

    public applyDamage(damage: number): void {
        this.health -= damage;
    }
}

export {Enemy, EnemyOptions}
