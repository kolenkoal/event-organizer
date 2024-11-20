import React from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { EVENT_ROUTE } from "../utils/consts";

const EventItem = ({ event }) => {
    const navigate = useNavigate();
    return (
        <Card
            className="mb-3 p-2"
            border="light"
            onClick={() => navigate(EVENT_ROUTE + "/" + event.id)}
        >
            <Row className="align-items-center">
                <Col md={4}>
                    <h5>{event.title}</h5>
                </Col>
                <Col md={3}>
                    <div>
                        <strong>Start:</strong> {event.start_time}
                    </div>
                    <div>
                        <strong>End:</strong> {event.end_time}
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
                        onClick={() => alert(`${event.description}`)}
                    >
                        Details
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

export default EventItem;
