import React, { useContext, useEffect, useState } from "react";
import { Button, Collapse, ListGroup, Card } from "react-bootstrap";
import CreateSubEvent from "./modals/CreateSubEvent";
import SubEventList from "./SubEventsList";
import { observer } from "mobx-react-lite";
import { Context } from "..";

const SubEvents = ({
    subevents,
    isCreator,
    onRegister,
    onUnregister,
    onDeleteItem,
    parentEventId,
    isRegisteredForSubEvent,
    setRegisteredForSubEvent,
    userId,
}) => {
    const [isSubEventsVisible, setSubEventsVisible] = useState(false);
    const [isSubEventModalVisible, setSubEventModalVisible] = useState(false);
    const [subEvents, setSubEvents] = useState([])
    const {event} = useContext(Context)
    const events = []

    const handleSubEventChange = () => {
        const updatedSubEvents = getSubEvents(event, parentEventId);
        setSubEvents(updatedSubEvents);
    };

    const getSubEvents = (events, eventId) => {
        const currentEvent = events.events.find(item => item.id === eventId)

        return currentEvent ? currentEvent.sub_events : []
    }

    useEffect(() => {
        const newSubEvents = getSubEvents(event, parentEventId)
        setSubEvents(newSubEvents)
        console.log('subevents', newSubEvents)
    }, [event])

    return (
        <div>
            <Button
                size="lg"
                className="shadow w-100"
                onClick={() => {
                    // console.log(event.events[0].sub_events)
                    // console.log('Events Subevents', event)

                    setSubEventsVisible(!isSubEventsVisible)}
                }
                aria-controls="subevents-list"
                aria-expanded={isSubEventsVisible}
            >
                {isSubEventsVisible
                    ? "Скрыть подмероприятия"
                    : `Показать подмероприятия (${subEvents.length})`}
            </Button>
            <Collapse in={isSubEventsVisible}>
                <div
                    id="subevents-list"
                    className="mt-3 border rounded p-3 bg-light shadow"
                >
                    <h5 className="text-center">Подмероприятия</h5>
                    <SubEventList
                        onSubEventChange={handleSubEventChange}
                        subevents={subEvents}
                        isCreator={isCreator}
                        onRegister={onRegister}
                        onDeleteItem={onDeleteItem}
                        onUnregister={onUnregister}
                        isRegisteredForSubEvent={isRegisteredForSubEvent}
                        setRegisteredForSubEvent={setRegisteredForSubEvent}
                        userId={userId}
                    />
                    {isCreator && (
                        <>
                            <Button
                                variant="success"
                                className="mt-3 w-100"
                                onClick={() => {

                                    setSubEventModalVisible(true)
                                }}
                            >
                                Добавить подмероприятие
                            </Button>
                        </>
                    )}
                    <CreateSubEvent
                        show={isSubEventModalVisible}
                        onHide={() => setSubEventModalVisible(false)}
                        // onSubmit={onAddSubEvent}
                        parentEventId={parentEventId}
                        onSubEventChange={handleSubEventChange}
                    />
                </div>
            </Collapse>
        </div>
    );
};

export default SubEvents;
