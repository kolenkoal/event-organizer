import { useState } from "react";
import {
    Container,
    Col,
    Image,
    Row,
    Button,
    Card,
    Badge,
    Accordion,
    Collapse,
    ListGroup,
} from "react-bootstrap";
import CreateEvent from "./modals/CreateEvent";
import SubEvents from "./SubEvents";

const EventDetails = ({
    event,
    onRegister,
    isCreator,
    onDeleteItem,
    isRegistered,
    onUnregister,
    participants,
    isRegisteredForSubEvent,
    setRegisteredForSubEvent,
    userId,
}) => {
    const [isEventVisible, setEventVisible] = useState(false);
    const [isParticipantsVisible, setParticipantsVisible] = useState(false);

    return (
        <div className="d-flex flex-column">
            <Container fluid className="bg-primary text-white p-4">
                <Col className="d-flex justify-content-around">
                    <h1 className="text-center">{event.title}</h1>
                    <Row>
                        {isCreator ? (
                            <div className="d-flex">
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
                                    style={{ marginLeft: "10px" }}
                                    className="shadow"
                                    onClick={() => onDeleteItem()}
                                >
                                    Удалить
                                </Button>
                            </div>
                        ) : (
                            <>
                                {isRegistered ? (
                                    <Button
                                        variant="danger"
                                        size="lg"
                                        className="shadow"
                                        onClick={() => onUnregister()}
                                    >
                                        Отписаться
                                    </Button>
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
                            </>
                        )}
                    </Row>
                </Col>
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
                        <h5>Адрес</h5>
                        <p className="text-muted">{event.location}</p>
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
                            <p
                                style={{
                                    fontSize: "1.2rem",
                                    whiteSpace: "pre-line",
                                }}
                            >
                                {event.description}
                            </p>
                        </div>
                    </Col>
                </Row>

                {event.sub_events && (
                    <Row className="mt-4">
                        <Col>
                            <SubEvents
                                subevents={event.sub_events}
                                onDeleteItem={onDeleteItem}
                                onUnregister={onUnregister}
                                onRegister={onRegister}
                                isCreator={isCreator}
                                parentEventId={event.id}
                                // isRegistered={isRegistered}
                                isRegisteredForSubEvent={
                                    isRegisteredForSubEvent
                                }
                                setRegisteredForSubEvent={
                                    setRegisteredForSubEvent
                                }
                                userId={userId}
                            />
                        </Col>
                    </Row>
                )}

                <Row className="mt-4 text-center"></Row>
                <Row className="mt-4">
                    <Col>
                        <Button
                            size="lg"
                            className="shadow w-100"
                            onClick={() =>
                                setParticipantsVisible(!isParticipantsVisible)
                            }
                            aria-controls="participants-list"
                            aria-expanded={isParticipantsVisible}
                        >
                            {isParticipantsVisible
                                ? "Скрыть участников"
                                : `Показать участников (${participants.length})`}
                        </Button>
                        <Collapse in={isParticipantsVisible}>
                            <div
                                id="participants-list"
                                className="mt-3 border rounded p-3 bg-light shadow"
                            >
                                <h5 className="text-center">Участники</h5>
                                <ListGroup
                                    style={{
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {participants.length > 0 ? (
                                        participants.map(
                                            (participant, index) => (
                                                <ListGroup.Item key={index}>
                                                    {participant.user_id}
                                                </ListGroup.Item>
                                            )
                                        )
                                    ) : (
                                        <p className="text-muted text-center mt-2">
                                            Участников пока нет
                                        </p>
                                    )}
                                </ListGroup>
                            </div>
                        </Collapse>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default EventDetails;
