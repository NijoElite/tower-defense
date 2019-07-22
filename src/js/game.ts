import {Tower} from './entities/tower';
import {Enemy} from './entities/enemy';
import {UIElement} from './ui/uiElement';
import towerFactory from './helpers/tower-factory';
import Level from './lib/level';
import {Place} from './entities/place';
import {Popup} from './entities/popup';

import grassLevel from './levels/level-1';
import { Point } from './lib/interfaces';
import { Frame } from './ui/frame';

let lastRender = 0;
let renderCounter = 0;
let drawBackground = false;

class Game {
    public pause: boolean;
    public level: Level;

    public frame: Frame;

    public enemies: Enemy[] = [];
    public towers: Tower[] = [];
    public popups: any = {};

    public constructor(foreground: HTMLCanvasElement, background: HTMLCanvasElement) {
        this.level = new grassLevel();
        this.frame = new Frame(foreground, background)

        this.frame.addBackground(this.level.map);

        this.level.map.on('onClick', this.onMapClick.bind(this));

        this.pause = false;

        this.createMenu();
        this.createPopups();
        
        this.level.places.forEach((place: Place): void => {
            place.on('onClick', this.placeClick.bind(this));
            this.level.map.appendChild(place);            
        });
    }

    protected onMapClick(): void {
        this.frame.popup = null;
    }


    private createPopups(): void {
        const build = new Popup({
            names: ['53.png'],
            position: {x: 0, y: 0},
            centered: true,
            size: {width: 176, height: 170},
        });

        const buildFireTower = new Popup({
            names: ['12.png'],
            position: {x: -55, y: -60},
            relative: true,
            size: {width: 55, height: 60},
            centered: true,
        });
        buildFireTower.action = towerFactory.fireTower;

        const buildStoneTower = new Popup({
            names: ['25.png'],
            position: {x: 60, y: 60},
            relative: true,
            size: {width: 55, height: 60},
            centered: true,
        });
        buildStoneTower.action = towerFactory.stoneTower;

        buildFireTower.on('onClick', this.buildClick.bind(this));
        buildStoneTower.on('onClick', this.buildClick.bind(this));

        build.appendChild(buildFireTower);
        build.appendChild(buildStoneTower);

        this.popups.build = build;
    }

    private createMenu(): void {
        const startX = 1600;
        const padding = 5;
        const size = 32;

        let count = 0;
        const nextPos = (): Point => {
            count++;
            return {
                x: startX - size * count + (1 - count) * padding,
                y: 0,
            };
        };

        const pauseBtn = new UIElement({
            names: ['pause-btn.png'],
            position: nextPos(),
        });

        pauseBtn.on('onClick', this.pauseClick.bind(this));

        this.frame.addBackground(pauseBtn);
    }

    private pauseClick(e): void {
        this.pause = !this.pause;
    }

    private placeClick(e): void {
        this.popups.build.position = {
            x: e.position.x + 16,
            y: e.position.y + 16,
        };

        this.popups.build.place = e;
        this.frame.popup = this.popups.build;
    }

    private buildClick(e): void {
        const popup = e.parent;
        const place = popup.place;

        const pos = popup.getAbsolutePosition();
        const tower = e.action(pos);

        this.towers.push(tower);
        this.frame.addForeground(tower);
        
        this.level.map.removeChild(place);
        drawBackground = true;

        this.frame.popup = null;
    }

    public start(): void {
        this.generateEnemies();
        window.requestAnimationFrame(this._loop.bind(this));
    }

    private onEnemyDeath(enemy: Enemy): void {
        this.level.money += 50;

        this.removeEnemy(enemy);        
        this.checkAliveEnemies();
    }

    private onEnemyFinished(enemy: Enemy): void {
        this.level.health -= 1;

        this.removeEnemy(enemy);
        this.checkAliveEnemies();
    }

    private removeTower(tower: Tower): void {
        this.towers.splice(this.towers.indexOf(tower), 1);
        this.frame.removeForeground(tower);
    }

    private removeEnemy(enemy: Enemy): void {
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
        this.frame.removeForeground(enemy);
    }

    public checkAliveEnemies(): void {
        if (this.enemies.length === 0) {
            setTimeout(this.generateEnemies.bind(this), 3000);
        }
    }

    public generateEnemies(): void {
        const onDeath = this.onEnemyDeath.bind(this);
        const onFinished = this.onEnemyFinished.bind(this);

        const enemies = this.level.generateEnemies(onDeath, onFinished);

        enemies.forEach((enemy: Enemy): void => {
            this.frame.addForeground(enemy);
            this.enemies.push(enemy);
        });
    }

    private update(progress: number): void  {
        this.enemies.forEach((enemy: Enemy): void => enemy.moveTo(progress));
        this.towers.forEach((tower: Tower): void => tower.attack(this.enemies));
    }

    private _loop(): void {
        if (lastRender === 0) {
            lastRender = Date.now();
        }
        
        const progress = Date.now() - lastRender;

        if (!this.pause) {
            this.update(progress);
        }

        this.frame.draw(drawBackground);

        drawBackground = renderCounter === 10;
        renderCounter = (renderCounter + 1) % 1000;

        lastRender = Date.now();
        window.requestAnimationFrame(this._loop.bind(this));
    }
}

export default Game;
