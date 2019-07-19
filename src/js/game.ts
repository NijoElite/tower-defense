import {Tower} from './entities/tower';
import {Enemy} from './entities/enemy';
import Layout from './lib/layout';
import {UIElement} from './ui/uiElement';
import towerFactory from './helpers/tower-factory';
import Level from './lib/level';
import {Place} from './entities/place';
import {Popup} from './entities/popup';

import grassLevel from './levels/level-1';
import { Point } from './lib/interfaces';

let lastRender = 0;
let stop = false;

class Game {
    public layout: Layout;
    public pause: boolean;
    public level: Level;

    private _popups;

    public constructor(canvas: HTMLCanvasElement) {
        this.level = new grassLevel();
        this.layout = new Layout(canvas, this.level.map);

        this.level.map.on('onClick', this.onMapClick.bind(this));

        this.pause = false;

        this._createMenu();
        this._createPopups();
        this.level.places.forEach((place: Place): void => {
            place.on('onClick', this.placeClick.bind(this));
            this.layout.addEntity(place);
        });
    }

    protected onMapClick(): void {
        if (this.pause) return;
        this.layout.closePopup();
    }


    private _createPopups(): void {
        this._popups = {};

        this._popups.pause = new Popup({
            names: ['pause-bg.png'],
            position: {x: 0, y: 0},
            size: {width: 1600, height: 900},
        });

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

        this._popups.build = build;
    }

    private _createMenu(): void {
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

        this.layout.addMenuItem(pauseBtn);
    }

    private pauseClick(e): void {
        this.pause = !this.pause;

        this.layout.showPopup(this._popups.pause);
    }

    private placeClick(e): void {
        this._popups.build.position = {
            x: e.position.x + 16,
            y: e.position.y + 16,
        };

        this._popups.build.place = e;

        this.layout.showPopup(this._popups.build);
    }

    private buildClick(e): void {
        const popup = e.parent;
        const place = popup.place;

        const pos = popup.getAbsolutePosition();

        const tower = e.action(pos);

        this.layout.removeEntity(place);
        this.layout.addEntity(tower);
        this.layout.closePopup();
    }


    public draw(): void {
        this.layout.draw();
    }

    public start(): void {
        this.generateEnemies();
        window.requestAnimationFrame(this._loop.bind(this));
    }

    public stop(): void {
        stop = true;
    }


    private onEnemyDeath(enemy: Enemy): void {
        this.level.money += 50;

        this.layout.removeEntity(enemy);
        this.checkAliveEnemies();
    }

    private onEnemyFinished(enemy: Enemy): void {
        this.level.health -= 1;

        this.layout.removeEntity(enemy);
        this.checkAliveEnemies();
    }

    public checkAliveEnemies(): void {
        const enemies = this.layout.getEnemies();
        if (enemies.length === 0) {
            setTimeout(this.generateEnemies.bind(this), 3000);
        }
    }

    public generateEnemies(): void {
        const onDeath = this.onEnemyDeath.bind(this);
        const onFinished = this.onEnemyFinished.bind(this);

        const enemies = this.level.generateEnemies(onDeath, onFinished);

        enemies.forEach((enemy: Enemy): void => {
            this.layout.addEntity(enemy);
        });
    }

    private update(progress: number): void  {
        const enemies = this.layout.getEnemies();
        const towers = this.layout.getTowers();

        enemies.forEach((enemy: Enemy): void => enemy.moveTo(progress));
        towers.forEach((tower: Tower): void => tower.attack(enemies));
    }

    private _loop(): void {
        if (lastRender === 0) {
            lastRender = Date.now();
        }

        this.draw();

        if (this.pause) {
            lastRender = Date.now();
            window.requestAnimationFrame(this._loop.bind(this));
            return;
        }

        const progress = Date.now() - lastRender;

        if (progress > 1000 / 45) {
            this.update(progress);
            lastRender = Date.now();
        }

        if (!stop) {
            window.requestAnimationFrame(this._loop.bind(this));
        }
    }
}

export default Game;
