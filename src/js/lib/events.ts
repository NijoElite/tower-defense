class GameEvent {
    public name: string;
    private _subscribers: Set<Function>;

    public constructor(name: string) {
        this.name = name;
        this._subscribers = new Set<Function>();
    }

    public add(fn: Function): void {
        if (this.contains(fn)) {
            const err = new Error(`Event ${this.name}` +
        'already contains that function');

            err.name = 'Event Error';
            throw err;
        }

        this._subscribers.add(fn);
    }

    public contains(fn: Function): boolean {
        return this._subscribers.has(fn);
    }

    public remove(fn: Function): void {
        if (!this.contains(fn)) {
            return;
        }

        this._subscribers.delete(fn);
    }

    public removeAll(): void {
        this._subscribers.clear();
    }

    public notifyAll(...args): void {
        this._subscribers.forEach((fn: Function): void => {
            fn(...args)
        });
    }
};

export default GameEvent;
