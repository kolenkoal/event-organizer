import React, { useEffect, useState } from "react";
import {
    Container,
    Col,
    Image,
    Row,
    Button,
    Card,
    Badge,
} from "react-bootstrap";
import { useParams } from "react-router";
import { FetchOneEvent, RegisterForEvent } from "../http/EventApi";

const EventPage = () => {
    const [event, setEvent] = useState({ info: [] });
    const [isRegistered, setRegistered] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        FetchOneEvent(id).then((data) => setEvent(data));
    }, []);

    const onRegister = () => {
        RegisterForEvent(id).then((data) => alert("Вы зарегистрированы"));
    };

    return (
        <div className="d-flex flex-column">
            <Container fluid className="bg-primary text-white p-4">
                <h1 className="text-center">{event.title}</h1>
            </Container>

            <Container className="flex-grow-1 d-flex flex-column justify-content-between py-4">
                <Row className="text-center my-3">
                    <Col>
                        <h5>Дата начала</h5>
                        <p className="text-muted">
                            {new Date(event.start_time).toLocaleDateString(
                                "ru-Ru",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            )}
                        </p>
                    </Col>
                    <Col>
                        <h5>Дата окончания</h5>
                        <p className="text-muted">
                            {new Date(event.end_time).toLocaleDateString(
                                "ru-Ru",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            )}
                        </p>
                    </Col>
                </Row>

                <Row className="my-3">
                    <Col>
                        <div className="p-4 border rounded bg-light shadow">
                            <h4 className="text-center mb-3">
                                Описание мероприятия
                            </h4>
                            <p style={{ fontSize: "1.2rem" }}>
                                {event.description}
                            </p>
                        </div>
                    </Col>
                </Row>

                <Row className="mt-4 text-center">
                    <Col>
                        {isRegistered ? (
                            <Button
                                variant="success"
                                size="lg"
                                className="shadow"
                                onClick={onRegister}
                            >
                                Зарегистрироваться
                            </Button>
                        ) : (
                            <Button
                                variant="danger"
                                size="lg"
                                className="shadow"
                                onClick={onRegister}
                            >
                                Ливнуть
                            </Button>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default EventPage;
