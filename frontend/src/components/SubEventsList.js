import React, { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import InfoSubEvent from "./InfoSubEvent";
import { DeleteEvent } from "../http/EventApi";
import { observer } from "mobx-react-lite";
import { Context } from "..";

const SubEventList = ({
    subevents,
    // onDeleteItem,
    onRegister,
    onUnregister,
    registeredEvents,
    isCreator,
    isRegisteredForSubEvent,
    setRegisteredForSubEvent,
    onSubEventChange
}) => {
    const onDeleteItem = async (id) => {
        try {
            await DeleteEvent(id);
            alert("Подмероприятие удалено");

            // Фильтруем подмероприятия, исключая удалённое
            onSubEventChange();
        } catch (error) {
            console.error("Ошибка при удалении подмероприятия:", error);
        }
    }
    
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
                            // overflow: "hidden",
                        }}
                    >
                        <InfoSubEvent
                            isCreator={isCreator}
                            event={subevent}
                            onDeleteItem={onDeleteItem}
                            isRegisteredForSubEvent={isRegisteredForSubEvent}
                            onRegister={onRegister}
                            onUnregister={onUnregister}
                            setRegisteredForSubEvent={setRegisteredForSubEvent}
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
