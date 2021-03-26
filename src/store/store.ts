export class Store {
    private subscribers: Function[];
    private reducers: { [key: string]: Function}
    private state: {[key: string]: any}

    constructor(
        reducers = {}, 
        initialState = {}
    ){
        this.subscribers = [];
        this.reducers = reducers;
        this.state = this.reduce(initialState, {});
    }

    get value() {
        return this.state;
    }

    subscribe(fn: Function) {
        this.subscribers = [...this.subscribers, fn];
        this.notify();

        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== fn);
        }
    }

    dispatch(action) {
        this.state = this.reduce(this.state, action);
        this.notify();
    }

    private notify() {
        this.subscribers.forEach(fn => fn(this.value));
    }

    private reduce(state, action) {
        const newState = {};
        for(const property in this.reducers) {
            newState[property] = this.reducers[property](state[property], action);
        }
        return newState;
    }
}