import React, { useEffect, useState } from "react";
import { Container, Col, Image, Row, Button, Card } from "react-bootstrap";
import { useParams } from "react-router";
import { FetchOneEvent } from "../http/EventApi";

const EventPage = () => {
    const [event, setEvent] = useState({ info: [] });
    const { id } = useParams();
    useEffect(() => {
        FetchOneEvent(id).then((data) => setEvent(data));
    });
    return (
        <Container>
            <Row>
                <Col md={4}>
                    <Image
                        width={300}
                        height={300}
                        src={"http://localhost:5000/" + event.img}
                    />
                </Col>

                <Col md={4}>
                    <Row className="d-flex flex-column align-items-center">
                        <h2>{event.name}</h2>
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                                background: `no-repeat center center`,
                                width: 240,
                                height: 240,
                                backgroundSize: "cover",
                                fontSize: 64,
                            }}
                        >
                            {event.rating}
                        </div>
                    </Row>
                </Col>
                <Col md={4}>
                    <Card
                        className="d-flex flex-column align-items-center justify-content-around"
                        style={{
                            width: 300,
                            height: 300,
                            fontsize: 32,
                            border: "5px solid lightgray",
                        }}
                    >
                        <h3>От: {event.price}</h3>
                        <Button variant={"outline-dark"}>
                            Добавить в корзину
                        </Button>
                    </Card>
                </Col>
            </Row>
            <Row className="d-flex flex-column m-3">
                <h1>Характеристики</h1>
                {event.info.map((info, index) => (
                    <Row
                        key={info.id}
                        style={{
                            background:
                                index % 2 === 0 ? "lightgray" : "transparent",
                        }}
                    >
                        {info.title}: {info.description}
                    </Row>
                ))}
            </Row>
        </Container>
    );
};

export default EventPage;
