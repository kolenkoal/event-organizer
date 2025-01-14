import { makeAutoObservable } from "mobx";

export default class EventStore {
    constructor() {
        this._events = [];
        makeAutoObservable(this);
    }

    setEvents(events) {
        this._events = events;
    }

    addEvent(event) {
        this._events.push(event)
    }

    addSubEvent(subEvent) {
        const parentEvent = this.events.find(event => event.id === subEvent.parent_event_id);
        if (parentEvent) {
            parentEvent.sub_events.push(subEvent);
        }
    }

    get events() {
        return this._events;
    }
}
