import { useState } from "react";
import {
    Container,
    Col,
    Image,
    Row,
    Button,
    Card,
    Badge,
} from "react-bootstrap";
import CreateEvent from "./modals/CreateEvent";
import { DeleteEvent } from "../http/EventApi";

const EventDetails = ({ event, onRegister, isCreator, onDeleteItem }) => {
    const [isEventVisible, setEventVisible] = useState(false);
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
                        {isCreator ? (
                            <>
                                <Button
                                    variant="danger"
                                    size="lg"
                                    className="shadow"
                                    onClick={() => setEventVisible(true)}
                                >
                                    Изменить
                                </Button>
                                <CreateEvent
                                    show={isEventVisible}
                                    onHide={() => setEventVisible(false)}
                                    event={event}
                                />
                                <Button
                                    variant="danger"
                                    size="lg"
                                    className="shadow"
                                    onClick={() => onDeleteItem()}
                                >
                                    Удалить
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="success"
                                size="lg"
                                className="shadow"
                                onClick={() => onRegister()}
                            >
                                Зарегистрироваться
                            </Button>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default EventDetails;
