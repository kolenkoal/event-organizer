import React, { useState } from "react";
import { Button, Collapse, ListGroup, Card } from "react-bootstrap";
import CreateSubEvent from "./modals/CreateSubEvent";
import SubEventList from "./SubEventsList";

const SubEvents = ({
    subevents,
    isCreator,
    onRegister,
    onUnregister,
    onDeleteItem,
    parentEventId,
    isRegisteredForSubEvent,
    setRegisteredForSubEvent,
}) => {
    const [isSubEventsVisible, setSubEventsVisible] = useState(false);
    const [isSubEventModalVisible, setSubEventModalVisible] = useState(false);

    return (
        <div>
            <Button
                size="lg"
                className="shadow w-100"
                onClick={() => setSubEventsVisible(!isSubEventsVisible)}
                aria-controls="subevents-list"
                aria-expanded={isSubEventsVisible}
            >
                {isSubEventsVisible
                    ? "Скрыть подмероприятия"
                    : `Показать подмероприятия (${subevents.length})`}
            </Button>
            <Collapse in={isSubEventsVisible}>
                <div
                    id="subevents-list"
                    className="mt-3 border rounded p-3 bg-light shadow"
                >
                    <h5 className="text-center">Подмероприятия</h5>
                    <SubEventList
                        subevents={subevents}
                        isCreator={isCreator}
                        onRegister={onRegister}
                        onDeleteItem={onDeleteItem}
                        onUnregister={onUnregister}
                        isRegisteredForSubEvent={isRegisteredForSubEvent}
                        setRegisteredForSubEvent={setRegisteredForSubEvent}
                    />
                    {isCreator && (
                        <>
                            <Button
                                variant="success"
                                className="mt-3 w-100"
                                onClick={() => setSubEventModalVisible(true)}
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
                    />
                </div>
            </Collapse>
        </div>
    );
};

export default SubEvents;
