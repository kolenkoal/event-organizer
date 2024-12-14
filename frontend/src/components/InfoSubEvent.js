import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { DeleteEvent, FetchEventParticipants, RegisterForEvent } from "../http/EventApi";
import { Context } from "..";
import CreateSubEvent from "./modals/CreateSubEvent";

const InfoSubEvent = ({
    event,
    onUnregister,
    isCreator,
    onRegister,
    onDeleteItem
    // isRegisteredForSubEvent,
    // isRegisteredForSubEvent,
}) => {
    const { user } = useContext(Context);
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    const [count, setCount] = useState(0);
    const info = {
        role: "LISTENER",
        artifacts: ["string"],
    };
    const [isRegisteredForSubEvent, setRegisteredForSubEvent] = useState(false);
    const [isEventVisible, setEventVisible] = useState(false);
    
    useEffect(() => {
        FetchEventParticipants(event.id).then((data) => {
            if (data) {
                data.participants.forEach((element) => {
                    if (element.user_id === user._user.id) {
                        setRegisteredForSubEvent(true);
                    }
                });
            }

            setCount(data.participants.length);
        });
    }, []);

    // const onRegister = () => {
    //     RegisterForEvent(event.id, info).then((data) => {

    //     })
    // }
    return (
        <Row
            className="align-items-center text-center justify-evenly"
            style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "100%",
                gap: "5px",
            }}
        >
            <Col className="text-wrap">
                <strong>{event.title}</strong>
            </Col>
            <Col className="text-wrap text-truncate">{event.description}</Col>
            <Col className="text-wrap text-truncate">
                {formatDate(event.start_time)}
            </Col>
            <Col className="text-wrap text-truncate">
                {formatDate(event.end_time)}
            </Col>
            <Col className="text-wrap text-truncate">{event.location}</Col>
            <Col className="text-wrap ">{count} участников</Col>
            <Col xs="auto" className="text-end">
                {isCreator ? (
                    <div className='d-flex gap-1'>
                        <Button
                            // className="btn btn-danger btn-sm m-1"
                            variant='outline-danger'
                            onClick={() => setEventVisible(true)}
                        >
                            Редактировать
                        </Button>
                        <CreateSubEvent 
                            subevent={event}
                            show={isEventVisible}
                            onHide={() => setEventVisible(false)}
                        />
                        <Button
                            // className="btn btn-danger btn-sm"
                            variant='danger'
                            onClick={() => onDeleteItem(event.id)}
                        >
                            <i className="bi bi-trash"></i>
                        </Button>
                    </div>
                ) : (
                    <>
                        {isRegisteredForSubEvent ? (
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                    const flag = onUnregister(event.id);
                                    if (flag) {
                                        setRegisteredForSubEvent(false);
                                    }
                                    setCount(count - 1);
                                }}
                            >
                                Отписаться
                            </button>
                        ) : (
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => {
                                    const flag = onRegister(event.id);
                                    if (flag) {
                                        setRegisteredForSubEvent(true);
                                    }
                                    setCount(count + 1);
                                }}
                            >
                                Записаться
                            </button>
                        )}
                    </>
                )}
            </Col>
        </Row>
    );
};

export default InfoSubEvent;
