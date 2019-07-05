import {Place} from '../entities/place';
import {GameMap} from '../entities/map';
import {Enemy} from '../entities/enemy';
import {Point} from './interfaces';

abstract class Level {
    public spawn: Point;
    public paths: Point[][];
    public places: Place[];
    public map: GameMap;

    public health: number;
    public money: number;
    public wave: number;

    public constructor(spawn: Point, paths: Point[][], places: Point[], mapName: string[]) {
        this.spawn = spawn;
        this.paths = paths;

        this.health = 0;
        this.money = 0;
        this.wave = 0;

        this.map = new GameMap({
            names: mapName,
            position: {
                x: 0,
                y: 0,
            },
            size: {
                width: 1600,
                height: 900,
            },
        });

        this.places = [];
        places.forEach((place: Point): void => {
            this.places.push(new Place({position: {x: place.x, y: place.y}}));
        });
    }

    abstract generateEnemies(onDeath: Function, onFinished: Function): Enemy[];
}

export default Level;
