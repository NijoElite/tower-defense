import {Enemy} from '../entities/enemy';
import {Point} from '../lib/interfaces';

class EnemyFactory {
    // 1 boss
    public static bossEnemy(position: Point): Enemy {
        return new Enemy(
            {
                health: 500,
                fps: 10,
                speed: 0.65,
                centered: true,
                position: {x: position.x, y: position.y},
                size: {width: 80, height: 80},
                names: ['enemy_1/frame0000.png', 'enemy_1/frame0004.png',
                    'enemy_1/frame0008.png', 'enemy_1/frame0012.png',
                    'enemy_1/frame0001.png', 'enemy_1/frame0005.png',
                    'enemy_1/frame0009.png', 'enemy_1/frame0013.png',
                    'enemy_1/frame0002.png', 'enemy_1/frame0006.png',
                    'enemy_1/frame0010.png', 'enemy_1/frame0014.png',
                    'enemy_1/frame0003.png', 'enemy_1/frame0007.png',
                    'enemy_1/frame0011.png', 'enemy_1/frame0015.png'],
            }
        );
    }

    // 2 fast
    public static fastEnemy(position: Point): Enemy {
        return new Enemy(
            {
                health: 50,
                fps: 10,
                speed: 2.5,
                centered: true,
                position: {x: position.x, y: position.y},
                size: {width: 25, height: 25},
                names: ['enemy_2/frame0000.png', 'enemy_2/frame0004.png',
                    'enemy_2/frame0008.png', 'enemy_2/frame0012.png',
                    'enemy_2/frame0001.png', 'enemy_2/frame0005.png',
                    'enemy_2/frame0009.png', 'enemy_2/frame0013.png',
                    'enemy_2/frame0002.png', 'enemy_2/frame0006.png',
                    'enemy_2/frame0010.png', 'enemy_2/frame0014.png',
                    'enemy_2/frame0003.png', 'enemy_2/frame0007.png',
                    'enemy_2/frame0011.png', 'enemy_2/frame0015.png'],
            }
        );
    }

    // 3 tank
    public static tankEnemy(position: Point): Enemy {
        return new Enemy(
            {
                health: 250,
                fps: 10,
                speed: 0.9,
                centered: true,
                position: {x: position.x, y: position.y},
                size: {width: 50, height: 50},
                names: ['enemy_3/frame0000.png', 'enemy_3/frame0004.png',
                    'enemy_3/frame0008.png', 'enemy_3/frame0012.png',
                    'enemy_3/frame0001.png', 'enemy_3/frame0005.png',
                    'enemy_3/frame0009.png', 'enemy_3/frame0013.png',
                    'enemy_3/frame0002.png', 'enemy_3/frame0006.png',
                    'enemy_3/frame0010.png', 'enemy_3/frame0014.png',
                    'enemy_3/frame0003.png', 'enemy_3/frame0007.png',
                    'enemy_3/frame0011.png', 'enemy_3/frame0015.png'],
            }
        );
    }

    // 4 typical
    public static typicalEnemy(position: Point): Enemy {
        return new Enemy(
            {
                health: 150,
                fps: 10,
                speed: 1.3,
                centered: true,
                position: {x: position.x, y: position.y},
                size: {width: 40, height: 40},
                names: ['enemy_4/frame0000.png', 'enemy_4/frame0004.png',
                    'enemy_4/frame0008.png', 'enemy_4/frame0012.png',
                    'enemy_4/frame0001.png', 'enemy_4/frame0005.png',
                    'enemy_4/frame0009.png', 'enemy_4/frame0013.png',
                    'enemy_4/frame0002.png', 'enemy_4/frame0006.png',
                    'enemy_4/frame0010.png', 'enemy_4/frame0014.png',
                    'enemy_4/frame0003.png', 'enemy_4/frame0007.png',
                    'enemy_4/frame0011.png', 'enemy_4/frame0015.png'],
            }
        );
    }

    public static random(position: Point): Enemy {
        const allFn = [this.typicalEnemy, this.tankEnemy, this.fastEnemy, this.bossEnemy];
        const i = Math.trunc(Math.random() * allFn.length);

        const create = allFn[i];

        return create(position);
    }
}
 

export default EnemyFactory;