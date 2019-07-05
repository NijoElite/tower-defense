import {Entity, EntityOptions} from './entity';
import {Enemy} from './enemy';

interface TowerOptions extends EntityOptions {
    damage?: number;
    range?: number;
    cooldown?: number;
}

class Tower extends Entity {
    public damage: number;
    public range: number;
    public cooldown: number;

    private _lastShot: number;
    
    public constructor(opts: TowerOptions) {
        super(opts);

        this.damage = opts.damage || 50;
        this.range = opts.range || 50;
        this._lastShot = Number.MIN_SAFE_INTEGER;

        this.cooldown = opts.cooldown || 500;
    }

    protected _getClosestTarget(targets: Enemy[]): Enemy {
        let closest: Enemy = null;
        let minDistance = Number.MAX_SAFE_INTEGER;

        targets.forEach((target: Enemy): void => {
            const distance = this._getDistanceToTarget(target);
            if (distance < minDistance && distance <= this.range) {
                closest = target;
                minDistance = distance;
            }
        });

        return closest;
    }

    protected _getDistanceToTarget(target: Enemy): number {
        const ePos = target.position;
        const tPos = this.position;

        const dx = Math.abs(tPos.x - ePos.x);
        const dy = Math.abs(tPos.y - ePos.y);

        return Math.sqrt(dx ** 2 + dy ** 2);
    }

    public attack(targets: Enemy[]): void {
        const timestamp = Date.now();
        if (timestamp - this._lastShot < this.cooldown ) {
            return;
        }

        this._lastShot = timestamp;
        const enemyTarget = this._getClosestTarget(targets);

        if (!enemyTarget) {
            return;
        }

        enemyTarget.applyDamage(this.damage);
    }
}

export {Tower};
