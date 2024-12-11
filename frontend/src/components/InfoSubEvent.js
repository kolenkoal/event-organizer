import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import { FetchEventParticipants, RegisterForEvent } from "../http/EventApi";
import { Context } from "..";

const InfoSubEvent = ({
    event,
    onUnregister,
    isCreator,
    onRegister,
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
            <Col className="text-truncate">
                <strong>{event.title}</strong>
            </Col>
            <Col className="text-muted text-truncate">{event.description}</Col>
            <Col className="text-muted text-truncate">
                {formatDate(event.start_time)}
            </Col>
            <Col className="text-muted text-truncate">
                {formatDate(event.end_time)}
            </Col>
            <Col className="text-muted text-truncate">{event.location}</Col>
            <Col className="text-muted text-truncate">{count} участников</Col>
            <Col xs="auto" className="text-end">
                {isCreator ? (
                    <>
                        <button
                            className="btn btn-danger btn-sm m-1"
                            // onClick={() => onUnregister(event.id)}
                        >
                            Редактировать
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            // onClick={() => onRegister(event.id)}
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </>
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
