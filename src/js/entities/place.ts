import {UIElement, UIElementOptions} from '../ui/uiElement';

const defaultSprites = ['place.png'];

class Place extends UIElement {
    public constructor(opts: UIElementOptions) {
        opts.names = defaultSprites;
        opts.size = {width: 35, height: 35};
        super(opts);
    }
}

export {Place};
