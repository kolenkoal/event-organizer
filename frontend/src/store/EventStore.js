import { makeAutoObservable } from "mobx";

export default class EventStore {
    constructor() {
        this._events = [];
        makeAutoObservable(this);
    }

    setEvents(events) {
        this._events = events;
    }

    get events() {
        return this._events;
    }
}
