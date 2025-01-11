import React, { useState } from "react";
import { Row, Col, Button, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { EVENT_ROUTE } from "../utils/consts";
import ShowDetails from "./modals/ShowDetails";

const EventItem = ({ event, isAuth }) => {
    const [detailsVisible, setDetailsVisible] = useState(false);
    const navigate = useNavigate();
    // console.log(event)
    return (
        <>
            <Card
                className="mb-3 p-2 border rounded bg-light shadow"
                border="light"
                onClick={() => {
                    console.log(isAuth)
                    if (isAuth) navigate(EVENT_ROUTE + "/" + event.id);
                }}
            >
                <Row className="d-flex justify-content-between align-items-center g-3">
                    <Col xs={12} sm={6} md={2} className="d-flex justify-content-center">
                        <Image
                        src={'https://storage.yandexcloud.net/test-bucket-event-organizer/events/e7fb084a-9f74-435b-b921-d4801a54b7a8/logo/a672b16c-1f35-4a5b-b59d-98c5a434ffe6_event.png'}
                        alt="Event Logo"
                        style={{
                            height: "auto",
                            width: "100%",
                            maxWidth: "100px", // Ограничиваем максимальную ширину
                        }}
                        />
                    </Col>

                    <Col xs={12} sm={6} md={2} className="d-flex justify-content-center">
                        <h5>{event.title}</h5>
                    </Col>

                    <Col xs={12} sm={6} md={2} className="d-flex justify-content-center">
                        <div>
                            <strong>Начало:</strong>{" "}
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
                        </div>   
                    </Col>

                    <Col xs={12} sm={6} md={2} className="d-flex justify-content-center">
                        <div>
                            <strong>Кончало:</strong>{" "}
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
                        </div>
                    </Col>

                    <Col xs={12} sm={6} md={2} className="d-flex justify-content-center">
                        <div>
                        <strong>Локация:</strong> {event.location}
                        </div>
                    </Col>

                    {/* <Col xs={12} sm={6} md={2} className="d-flex justify-content-center">
                        <Button
                        variant="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDetailsVisible(true);
                        }}
                        >
                        Детали
                        </Button>
                    </Col> */}
                    </Row>
            </Card>
            <ShowDetails
                show={detailsVisible}
                onHide={() => {
                    setDetailsVisible(false);
                }}
                details={event.description}
            />
        </>
    );
};

export default EventItem;
