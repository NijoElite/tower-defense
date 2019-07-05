import resources from './resources';

class SpriteSet {
    public fps;
    public names;

    private _frames: ImageBitmap[] = [];
    private _frameIndex: number;
    private _lastUpdate: number;

    public constructor(fps = 30, names = []) {
        this.fps = fps;
        this._frameIndex = 0;
        this._lastUpdate = 0;
        resources.getResources(names).then((res): void => {
            this._frames = res;
        });
    }

    public getCurrentFrame(): ImageBitmap {
        return this._frames[this._frameIndex];
    }

    public getNextFrame(): ImageBitmap {
        const now = Date.now();
        const frameTime = 1000 / this.fps;

        if (this._frames.length === 0) {
            return null;
        }

        if (this._lastUpdate === 0) {
            this._lastUpdate = now;
        }

        if (now - this. _lastUpdate < frameTime) {
            return this.getCurrentFrame();
        }
        
        this._lastUpdate = now;

        this._frameIndex = (this._frameIndex + 1) % this._frames.length;

        return this._frames[this._frameIndex];
    }
}

export default SpriteSet;
