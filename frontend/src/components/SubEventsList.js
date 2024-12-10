import React from "react";
import { ListGroup } from "react-bootstrap";
import InfoSubEvent from "./InfoSubEvent";

const SubEventList = ({
    subevents,
    onDeleteItem,
    onRegister,
    onUnregister,
    registeredEvents,
    isCreator,
    isRegisteredForSubEvent,
}) => {
    return (
        <ListGroup
            style={{
                maxHeight: "200px",
                overflowY: "auto",
            }}
            className="w-100"
        >
            {subevents.length > 0 ? (
                subevents.map((subevent, index) => (
                    <ListGroup.Item
                        key={index}
                        className="p-2"
                        style={{
                            width: "100%",
                            overflow: "hidden",
                        }}
                    >
                        <InfoSubEvent
                            isCreator={isCreator}
                            event={subevent}
                            isRegisteredForSubEvent={isRegisteredForSubEvent}
                            onRegister={onRegister}
                            onUnregister={onUnregister}
                        />
                    </ListGroup.Item>
                ))
            ) : (
                <p className="text-muted text-center mt-2">
                    Подмероприятий пока нет
                </p>
            )}
        </ListGroup>
    );
};

export default SubEventList;
