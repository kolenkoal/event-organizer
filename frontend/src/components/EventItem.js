import React, { useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { EVENT_ROUTE } from "../utils/consts";
import ShowDetails from "./modals/ShowDetails";

const EventItem = ({ event, isAuth }) => {
    const [detailsVisible, setDetailsVisible] = useState(false);
    const navigate = useNavigate();
    return (
        <>
            <Card
                className="mb-3 p-2 border rounded bg-light shadow"
                border="light"
                onClick={() => {
                    if (isAuth) navigate(EVENT_ROUTE + "/" + event.id);
                }}
            >
                <Row className="align-items-center">
                    <Col md={4}>
                        <h5>{event.title}</h5>
                    </Col>
                    <Col md={3}>
                        <div>
                            <strong>Start:</strong>{" "}
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
                        <div>
                            <strong>End:</strong>{" "}
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
                    <Col md={3}>
                        <div>
                            <strong>Location:</strong> {event.location}
                        </div>
                    </Col>
                    <Col md={2} className="text-end">
                        <Button
                            variant="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDetailsVisible(true);
                            }}
                        >
                            Детали
                        </Button>
                    </Col>
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
