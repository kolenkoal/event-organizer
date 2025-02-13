import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import CreateEvent from "../components/modals/CreateEvent";
import { useNavigate } from "react-router";
import { EVENTS_ROUTE } from "../utils/consts";
import QuestionModal from "../components/modals/QuestionModal";

const Main = observer(() => {
    const [eventVisible, setEventVisible] = useState(false)
    const [helperVisible, setHelperVisible] = useState(false)
    const navigate = useNavigate()
    return (
        <Container className="text-center mt-5">
        {/* Заголовок и описание */}
        <Row>
            <Col>
            <h1>Организуйте и участвуйте в мероприятиях</h1>
            <p className="lead">Создавайте события, записывайтесь на них и находите интересные мероприятия поблизости!</p>
            <Button 
                variant="primary" 
                className="m-2" 
                onClick={() => setEventVisible(true)}
            >
                Создать мероприятие
            </Button>
            <CreateEvent
                show={eventVisible}
                onHide={() => setEventVisible(false)}
            />
            <Button 
                variant="outline-primary" 
                className="m-2"
                onClick={() => navigate(EVENTS_ROUTE)}
            >
                Найти мероприятие
            </Button>
            <Button
                variant="outline-primary" 
                className="m-2"
                onClick={() => setHelperVisible(true)}
            >
                Как пользоваться ?
            </Button>
            <QuestionModal 
                show={helperVisible}
                onHide={() => setHelperVisible(false)}
            />
            </Col>
        </Row>

        {/* Карточки с преимуществами */}
        <Row className="mt-5">
            <Col md={4}>
            <Card>
                <Card.Body>
                <Card.Title>Простота</Card.Title>
                <Card.Text>Создавайте события в пару кликов!</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col md={4}>
            <Card>
                <Card.Body>
                <Card.Title>Гибкость</Card.Title>
                <Card.Text>Выбирайте удобные параметры и категории.</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col md={4}>
            <Card>
                <Card.Body>
                <Card.Title>Сообщество</Card.Title>
                <Card.Text>Находите мероприятия по душе и участвуйте!</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            
        </Row>
        <Row className='mt-5'>
        <Col md={6}>
            <Card>
                <Card.Body>
                <Card.Title>Приходите и слушайте !</Card.Title>
                <Card.Text>Для этого зарегистрируйтесь на мероприятие !</Card.Text>
                </Card.Body>
            </Card>
            </Col>
            <Col md={6}>
            <Card>
                <Card.Body>
                <Card.Title>Приходите и участвуйте !</Card.Title>
                <Card.Text>Просто подайте заявку на странице мероприятия !</Card.Text>
                </Card.Body>
            </Card>
            </Col>
        </Row>
        </Container>
    );
});

export default Main;
