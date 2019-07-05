import {Entity, EntityOptions} from './entity';

const defaultSprites = ['place.png'];

class Place extends Entity {
    public constructor(opts: EntityOptions) {
        opts.names = defaultSprites;
        opts.size = {width: 35, height: 35};
        super(opts);
    }
}

export {Place};
