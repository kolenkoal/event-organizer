import React, { useState, useEffect } from "react";
import { Modal, ListGroup, Button } from "react-bootstrap";
import { FetchEventParticipants } from "../../http/EventApi";

const SubEventParticipantsModal = ({ show, onHide, subEventId }) => {
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Функция для загрузки участников подмероприятия
    const fetchParticipants = async () => {
        setIsLoading(true);
        try {
            const response = await FetchEventParticipants(subEventId);
            console.log(response)
            setParticipants(response.participants);
        } catch (error) {
            console.error("Ошибка при загрузке участников:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Загружаем участников при открытии модального окна
    useEffect(() => {
        if (show) {
            fetchParticipants();
        }
    }, [show, subEventId]);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Участники подмероприятия</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <p>Загрузка участников...</p>
                ) : participants.length > 0 ? (
                    <ListGroup>
                        {participants.map((participant) => (
                            <ListGroup.Item key={participant.user_id}>
                                {participant.user.first_name + ' ' +participant.user.last_name} ({participant.user.email})
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p>Нет участников.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SubEventParticipantsModal;