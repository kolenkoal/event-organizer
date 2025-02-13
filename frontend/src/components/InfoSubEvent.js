import React, { useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import CreateSubEvent from "./modals/CreateSubEvent";
import SubEventParticipantsModal from "./modals/SubEventParticipantsModal";

const InfoSubEvent = ({ event, onUnregister, isCreator, onRegister, onDeleteItem, isRegisteredForSubEvent, participantCount, setParticipantsData }) => {
    const [isEventVisible, setEventVisible] = useState(false);
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);
    const [selectedSubEventId, setSelectedSubEventId] = useState(null);
    // console.log(isRegisteredForSubEvent)
    const formatDate = (date) => new Date(date).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const handleShowParticipants = (subEventId) => {
        setSelectedSubEventId(subEventId);
        setShowParticipantsModal(true);
    };

    const handleRegister = async () => {
        const success = await onRegister(event.id);
        if (success) {
            setParticipantsData(prev => ({
                ...prev,
                [event.id]: {
                    count: prev[event.id]?.count + 1 || 1,
                    isRegistered: true,
                },
            }));
        }
    };

    const handleUnregister = async () => {
        const success = await onUnregister(event.id);
        if (success) {
            setParticipantsData(prev => ({
                ...prev,
                [event.id]: {
                    count: prev[event.id]?.count - 1 || 0,
                    isRegistered: false,
                },
            }));
        }
    };

    return (
        // <Row className="align-items-center text-center justify-evenly" style={{ overflow: "hidden", whiteSpace: "nowrap", width: "100%", gap: "5px" }}>
        //     <Col className="text-wrap"><strong>{event.title}</strong></Col>
        //     <Col className="text-wrap text-truncate">{event.description}</Col>
        //     <Col className="text-wrap text-truncate">{formatDate(event.start_time)}</Col>
        //     <Col className="text-wrap text-truncate">{formatDate(event.end_time)}</Col>
        //     <Col className="text-wrap text-truncate">{event.location}</Col>
        //     <Col className="text-wrap">
        //         <Row>{participantCount} участников</Row>
        //     </Col>
        //     <Col xs="auto" className="text-end">
        //         <Row> 
        //             <Button className="btn btn-sm mb-1" onClick={() => handleShowParticipants(event.id)}>Показать</Button>
        //             <SubEventParticipantsModal show={showParticipantsModal} onHide={() => setShowParticipantsModal(false)} subEventId={selectedSubEventId} />
        //         </Row>
        //         <Row>
        //             {isCreator ? (
        //                 <div className='d-flex gap-1'>
        //                     <Button variant='outline-danger' onClick={() => setEventVisible(true)}>Редактировать</Button>
        //                     <CreateSubEvent subevent={event} show={isEventVisible} onHide={() => setEventVisible(false)} />
        //                     <Button variant='danger' onClick={() => onDeleteItem(event.id)}>
        //                         <i className="bi bi-trash"></i>
        //                     </Button>
        //                 </div>
        //             ) : (
        //                 <>
        //                     {isRegisteredForSubEvent ? (
        //                         <Button className="btn btn-danger btn-sm" onClick={handleUnregister}>Отписаться</Button>
        //                     ) : (
        //                         <Button className="btn btn-success btn-sm" onClick={handleRegister}>Записаться</Button>
        //                     )}
        //                 </>
        //             )}
        //         </Row>
        //     </Col>
        // </Row>
        <Card className="mb-2 shadow-sm">
            <Card.Body
                className="d-grid text-center"
                style={{ gridTemplateColumns: "1fr 3fr 2fr 2fr 2fr 1fr 2fr", gap: "10px", alignItems: "center" }}
            >
                {/* Название */}
                <div className="text-wrap">
                    <strong>{event.title}</strong>
                </div>

                {/* Описание */}
                <div className="text-wrap text-truncate">
                    {event.description}
                </div>

                {/* Дата начала */}
                <div className="text-wrap text-truncate">
                    {formatDate(event.start_time)}
                </div>

                {/* Дата конца */}
                <div className="text-wrap text-truncate">
                    {formatDate(event.end_time)}
                </div>

                {/* Место проведения */}
                <div className="text-wrap text-truncate">
                    {event.location}
                </div>

                {/* Количество участников */}
                <div className="text-wrap">
                    {participantCount} участников
                </div>

                {/* Действия */}
                <div className="d-flex flex-column gap-1">
                    <Button className="btn btn-sm" onClick={() => handleShowParticipants(event.id)}>
                        Показать
                    </Button>
                    <SubEventParticipantsModal 
                        show={showParticipantsModal} 
                        onHide={() => setShowParticipantsModal(false)} 
                        subEventId={selectedSubEventId} 
                    />
                    {isCreator ? (
                        <div className="d-flex gap-1">
                            <Button variant="outline-primary" onClick={() => setEventVisible(true)}>Редактировать</Button>
                            <CreateSubEvent subevent={event} show={isEventVisible} onHide={() => setEventVisible(false)} />
                            <Button variant="danger" onClick={() => onDeleteItem(event.id)}>
                                <i className="bi bi-trash"></i>
                            </Button>
                        </div>
                    ) : (
                        <>
                            {isRegisteredForSubEvent ? (
                                <Button className="btn btn-danger btn-sm" onClick={handleUnregister}>Отписаться</Button>
                            ) : (
                                <Button className="btn btn-success btn-sm" onClick={handleRegister}>Записаться</Button>
                            )}
                        </>
                    )}
                </div>
            </Card.Body>
        </Card>

        // <>{subevents.length > 0 ? (
        //     <ListGroup className="mt-3">
        //         <Card className="mb-3 shadow-sm">
        //             <Card.Body
        //                 className="d-grid text-center fw-bold"
        //                 style={{ gridTemplateColumns: "2fr 3fr 2fr 2fr 2fr 1fr", gap: "10px" }}
        //             >
        //                 <div>Название</div>
        //                 <div>Описание</div>
        //                 <div>Дата начала</div>
        //                 <div>Дата конца</div>
        //                 <div>Место проведения</div>
        //                 <div>Участники</div>
        //                 <div>Действия</div>
        //             </Card.Body>
        //         </Card>
        
        //         {subevents.map((subevent) => (
        //             <Card key={subevent.id} className="mb-3 shadow-sm">
        //                 <Card.Body
        //                     className="d-grid text-center"
        //                     style={{ gridTemplateColumns: "2fr 3fr 2fr 2fr 2fr 1fr", gap: "10px" }}
        //                 >
        //                     {/* Название */}
        //                     <div className="text-wrap">
        //                         <strong>{subevent.title}</strong>
        //                     </div>
        
        //                     {/* Описание */}
        //                     <div className="text-wrap text-truncate">
        //                         {subevent.description}
        //                     </div>
        
        //                     {/* Дата начала */}
        //                     <div className="text-wrap text-truncate">
        //                         {formatDate(subevent.start_time)}
        //                     </div>
        
        //                     {/* Дата конца */}
        //                     <div className="text-wrap text-truncate">
        //                         {formatDate(subevent.end_time)}
        //                     </div>
        
        //                     {/* Место проведения */}
        //                     <div className="text-wrap text-truncate">
        //                         {subevent.location}
        //                     </div>
        
        //                     {/* Количество участников */}
        //                     <div className="text-wrap">
        //                         {/* {participantsData[subevent.id]?.count || 0} участников */}
        //                         {participantCount}
        //                     </div>
        
        //                     {/* Действия */}
        //                     <div>
        //                         <Button className="btn btn-sm mb-1" onClick={() => handleShowParticipants(subevent.id)}>
        //                             Показать
        //                         </Button>
        //                         <SubEventParticipantsModal 
        //                             show={showParticipantsModal} 
        //                             onHide={() => setShowParticipantsModal(false)} 
        //                             subEventId={selectedSubEventId} 
        //                         />
        //                         {isCreator ? (
        //                             <div className='d-flex gap-1 mt-2'>
        //                                 <Button variant='outline-primary' onClick={() => setEventVisible(true)}>
        //                                     Редактировать
        //                                 </Button>
        //                                 <CreateSubEvent 
        //                                     subevent={subevent} 
        //                                     show={isEventVisible} 
        //                                     onHide={() => setEventVisible(false)} 
        //                                 />
        //                                 <Button variant='danger' onClick={() => onDeleteItem(subevent.id)}>
        //                                     <i className="bi bi-trash"></i>
        //                                 </Button>
        //                             </div>
        //                         ) : (
        //                             <div className="mt-2">
        //                                 {isRegisteredForSubEvent ? (
        //                                     <Button className="btn btn-danger btn-sm" onClick={() => onUnregister(subevent.id)}>
        //                                         Отписаться
        //                                     </Button>
        //                                 ) : (
        //                                     <Button className="btn btn-success btn-sm" onClick={() => onRegister(subevent.id)}>
        //                                         Записаться
        //                                     </Button>
        //                                 )}
        //                             </div>
        //                         )}
        //                     </div>
        //                 </Card.Body>
        //             </Card>
        //         ))}
        //     </ListGroup>
        // ) : (
        //     <p className="text-muted text-center mt-2">Подмероприятий пока нет</p>
        // )}</>
        
    );
};

export default InfoSubEvent;
