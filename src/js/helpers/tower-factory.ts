import {Tower} from '../entities/tower';
import {Point} from '../lib/interfaces';

class TowerFactory {
    public static fireTower(position: Point): Tower {
        const tower = new Tower({
            names: ['12.png'],
            damage: 5,
            range: 100,
            cooldown: 50,
            size: {width: 36, height: 50},
            position: position,
            centered: true,
        });
        return tower;
    }
    
    public static stoneTower(position: Point): Tower {
        const tower = new Tower({
            names: ['6.png'],
            damage: 150,
            range: 300,
            cooldown: 3000,
            size: {width: 36, height: 50},
            position: position,
            centered: true,
        });
        return tower;
    }
}


export default TowerFactory;
