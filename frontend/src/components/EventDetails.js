import { useState, useEffect } from "react";
import {
    Container,
    Col,
    Row,
    Button,
    Collapse,
    ListGroup,
    Image,
} from "react-bootstrap";
import CreateEvent from "./modals/CreateEvent";
import SubEvents from "./SubEvents";
import CreateRequest from "./modals/CreateRequest";
import RequestStatus from "./helper/RequestStatus";
import LogoUploadModal from "./modals/LogoUploadModal";

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
    requestStatus,
}) => {
    const storedLogo = localStorage.getItem(`eventLogo_${event.id}`);
    const [isEventVisible, setEventVisible] = useState(false);
    const [isParticipantsVisible, setParticipantsVisible] = useState(false);
    const [isRequestVisible, setRequestVisible] = useState(false);
    const [logoUrl, setLogoUrl] = useState(event.logo_url || "");
    const [isHovered, setIsHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    console.log(typeof storedLogo);

    useEffect(() => {
        const type = typeof storedLogo;
        if (type !== "object") {
            setLogoUrl(storedLogo.toString());
        }
    }, [storedLogo]);

    return (
        <div className="d-flex flex-column">
            <Container
                fluid
                className="bg-primary text-white d-flex align-items-center py-3"
            >
                <Col className="d-flex justify-content-around align-items-center">
                    {logoUrl ? (
                        <div
                            className="position-relative"
                            style={{
                                height: "100%",
                                width: "auto",
                                maxWidth: "100px",
                                marginRight: "15px",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                if (isCreator) setShowModal(true);
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <Image
                                src={logoUrl}
                                alt="Event Logo"
                                style={{
                                    height: "100%", // Занимает всю высоту контейнера
                                    width: "auto",
                                    maxWidth: "100px", // Ограничиваем максимальную ширину
                                    transition: "opacity 0.3s ease",
                                    opacity: isHovered ? 0.5 : 1, // Затемнение при наведении
                                }}
                            />
                        </div>
                    ) : (
                        <Button
                            variant="outline-light"
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                            }}
                            onClick={() => {
                                if (isCreator) setShowModal(true);
                            }}
                        >
                            <i class="bi bi-image-alt"></i>
                        </Button>
                    )}
                    <h1 className="">{event.title}</h1>
                    <RequestStatus requestStatus={requestStatus} />
                    <LogoUploadModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        setLogoUrl={setLogoUrl}
                        eventId={event.id}
                    />
                    {requestStatus !== "REJECTED" && (
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
                                        event={event}
                                        show={isEventVisible}
                                        onHide={() => setEventVisible(false)}
                                    />
                                    <Button
                                        variant="danger"
                                        size="lg"
                                        className="shadow ms-2"
                                        onClick={onDeleteItem}
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
                                        <div>
                                            <Button
                                                variant="success"
                                                size="lg"
                                                className="shadow w-100 mb-2"
                                                onClick={() => onRegister()}
                                            >
                                                Зарегистрироваться
                                            </Button>
                                            <Button
                                                variant="warning"
                                                size="lg"
                                                className="shadow w-100"
                                                onClick={() =>
                                                    setRequestVisible(true)
                                                }
                                            >
                                                Подать заявку
                                            </Button>
                                            <CreateRequest
                                                show={isRequestVisible}
                                                onHide={() =>
                                                    setRequestVisible(false)
                                                }
                                                eventId={event.id}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </Row>
                    )}
                </Col>
            </Container>

            <Container className="flex-grow-1 d-flex flex-column justify-content-between py-4">
                <Row className="text-center my-3">
                    <Col>
                        <h5>Дата начала</h5>
                        <p className="text-muted">
                            {new Date(event.start_time).toLocaleString(
                                "ru-RU",
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
                            {new Date(event.end_time).toLocaleString("ru-RU", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
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
                                className="fs-5"
                                style={{ whiteSpace: "pre-line" }}
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
