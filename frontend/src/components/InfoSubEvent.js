import React from "react";
import { Row, Col } from "react-bootstrap";

const InfoSubEvent = ({
    event,
    isRegisteredForSubEvent,
    onRegister,
    onUnregister,
    isCreator,
}) => {
    const formatDate = (date) =>
        new Date(date).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    console.log("SubEventIsreg", isRegisteredForSubEvent);
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
            <Col className="text-muted text-truncate">{10} участников</Col>
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
                                onClick={() => onUnregister(event.id)}
                            >
                                Отписаться
                            </button>
                        ) : (
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => onRegister(event.id)}
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
