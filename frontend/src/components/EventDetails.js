import { useState, useEffect } from "react";
import {
    Container,
    Col,
    Row,
    Button,
    Collapse,
    ListGroup,
    Image,
    Offcanvas,
    Card
} from "react-bootstrap";
import CreateEvent from "./modals/CreateEvent";
import SubEvents from "./SubEvents";
import CreateRequest from "./modals/CreateRequest";
import RequestStatus from "./helper/RequestStatus";
import LogoUploadModal from "./modals/LogoUploadModal";
import AdminRequestsSidebar from "./AdminRequestsSidebar";
import ParticipantsSidebar from "./ParticipantsSidebar";
import { observer } from "mobx-react-lite";
import { FetchEventParticipants, getEventListeners } from "../http/EventApi";

const EventDetails = observer(({
    eventInfo,
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
    onRegisterLikeParticipant,
    listeners
}) => {
    // const storedLogo = localStorage.getItem(`eventLogo_${event.id}`);
    const [isEventVisible, setEventVisible] = useState(false);
    const [isParticipantsVisible, setParticipantsVisible] = useState(false);
    const [isRequestVisible, setRequestVisible] = useState(false);
    const [logoUrl, setLogoUrl] = useState(eventInfo.logo_url || "");
    const [isHovered, setIsHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [totalSubEventParticipants, setTotalSubEventParticipants] = useState(0);

    const [newListeners, setNewListeners] = useState([])
    // console.log('eventInfo', eventInfo)
    useEffect(() => {
        setLogoUrl(eventInfo.logo_url)
    }, [eventInfo.logo_url]);
    // console.log()
    useEffect(() => {
        const fetchSubEventParticipants = async () => {
            if (eventInfo.sub_events && eventInfo.sub_events.length > 0) {
                let total = 0;
                for (const subEvent of eventInfo.sub_events) {
                    try {
                        const participants = await FetchEventParticipants(subEvent.id);
                        // console.log('part', participants)
                        total += participants.participants.length;
                    } catch (error) {
                        console.error("Ошибка при получении участников подмероприятия:", error);
                    }
                }
                setTotalSubEventParticipants(total);
            }
        };

        // getEventListeners(eventInfo.id).then((data) => {
        //     setNewListeners(data.listeners)
        // })
        fetchSubEventParticipants();
    }, [eventInfo.sub_events, listeners.length]);
    
    return (
        <div className="d-flex flex-column">
            {/* Боковая панель участников */}
            {isCreator ? (<AdminRequestsSidebar 
                eventId={eventInfo.id}
                show={isParticipantsVisible}
                handleClose={() => setParticipantsVisible(!isParticipantsVisible)}
            />) : (
                <ParticipantsSidebar 
                    show={isParticipantsVisible}
                    handleClose={() => setParticipantsVisible(!isParticipantsVisible)}
                    participants={participants}
                    listeners={listeners}
                />
            )}
            
            
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
                            <i className="bi bi-image-alt"></i>
                        </Button>
                    )}
                    <h1 className="">{eventInfo.title}</h1>
                    <RequestStatus requestStatus={requestStatus} />
                    <LogoUploadModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        setLogoUrl={setLogoUrl}
                        eventId={eventInfo.id}
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
                                        eventInfo={eventInfo}
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
                                            {eventInfo.requires_participants === true && (
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
                                            )}
                                            
                                            <CreateRequest
                                                show={isRequestVisible}
                                                onHide={() =>{
                                                    setRequestVisible(false)
                                                }}
                                                eventId={eventInfo.id}
                                                onRegisterLikeParticipant={onRegisterLikeParticipant}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </Row>
                    )}
                </Col>
                <Button
                        variant="light"
                        className="d-flex align-items-center"
                        onClick={() => setParticipantsVisible(!isParticipantsVisible)}
                        style={{
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <i className="bi bi-people-fill"></i>
                    </Button>
            </Container>

            <Container className="flex-grow-1 d-flex flex-column justify-content-between py-4">
                <Row className="text-center my-3">
                    <Col>
                        <Card>
                            <Card.Header> 
                                Локация
                            </Card.Header>
                            <Card.Body>
                                {eventInfo.location}
                            </Card.Body>
                        </Card>
                        {/* <h5>Локация</h5>
                        <p className="text-muted">{eventInfo.location}</p> */}
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header> 
                                Дата начала
                            </Card.Header>
                            <Card.Body>
                                {new Date(eventInfo.start_time).toLocaleString(
                                    "ru-RU",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </Card.Body>
                        </Card>
                        {/* <h5>Дата начала</h5>
                        <p className="text-muted">
                            {new Date(eventInfo.start_time).toLocaleString(
                                "ru-RU",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            )}
                        </p> */}
                    </Col>
                    
                    <Col>
                        <Card>
                            <Card.Header> 
                                Дата окончания
                            </Card.Header>
                            <Card.Body>
                                {new Date(eventInfo.end_time).toLocaleString("ru-RU", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Card.Body>
                        </Card>
                        {/* <h5>Дата окончания</h5>
                        <p className="text-muted">
                            {new Date(eventInfo.end_time).toLocaleString("ru-RU", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p> */}
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header> 
                                Всего людей
                            </Card.Header>
                            <Card.Body>
                                {listeners.length + participants.length + totalSubEventParticipants + ` (В подмероприятиях: ${totalSubEventParticipants})`}
                                {/* {` (В подмероприятиях: ${totalSubEventParticipants})`} */}
                            </Card.Body>
                        </Card>
                        {/* <h5>Всего людей</h5>
                        <p className="text-muted">
                            {listeners.length + participants.length + totalSubEventParticipants}
                            {` (В подмероприятиях: ${totalSubEventParticipants})`}
                        </p> */}
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
                                {eventInfo.description}
                            </p>
                        </div>
                    </Col>
                </Row>

                {eventInfo.sub_events && (
                    // <Row className="mt-4">
                    //     <Col>
                            <SubEvents
                                subevents={eventInfo.sub_events}
                                onDeleteItem={onDeleteItem}
                                onUnregister={onUnregister}
                                onRegister={onRegister}
                                isCreator={isCreator}
                                parentEventId={eventInfo.id}
                                isRegisteredForSubEvent={
                                    isRegisteredForSubEvent
                                }
                                setRegisteredForSubEvent={
                                    setRegisteredForSubEvent
                                }
                                userId={userId}
                            />
                    //     {/* </Col>
                    // </Row> */}
                )}
            </Container>
        </div>
    );
});

export default EventDetails;
