import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AddEvent, FetchEvent, PatchEvent } from "../../http/EventApi";
import { Context } from "../..";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

const CreateEvent = observer(({ show, onHide, event }) => {
    const { user } = useContext(Context);
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");

    const formatDateForInput = (date) => {
        if (!date) return "";
        const localDate = new Date(date);
        const utcOffset = localDate.getTimezoneOffset();
        localDate.setMinutes(localDate.getMinutes() - utcOffset);

        return localDate.toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setStartDate(formatDateForInput(event.start_time));
            setEndDate(formatDateForInput(event.end_time));
            setDescription(event.description);
            setLocation(event.location);
        }
    }, [event]);

    const addEvent = () => {
        const parsedStartDatetime = new Date(startDate);
        const parsedEndDatetime = new Date(endDate);
        const eventData = {
            title,
            description,
            "start_time": parsedStartDatetime.toISOString(),
            "end_time": parsedEndDatetime.toISOString(),
            location,
        };
        if (event) {
            PatchEvent(eventData, event.id, user.token).then((data) =>
                onHide()
            );
        } else {
            AddEvent(eventData, user.token).then((data) => {
                onHide();
            });
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить мероприятие
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="md-3">
                        <Form.Label>Название мероприятия</Form.Label>
                        <Form.Control
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Введите название мероприятия"
                        />
                    </Form.Group>
                    <Form.Group className="md-3">
                        <Form.Label>Дата начала</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Дата окончания</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Введите имя создателя"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Локация</Form.Label>
                        <Form.Control
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Введите локацию"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрыть
                </Button>
                <Button variant="outline-success" onClick={addEvent}>
                    {event ? "Обновить" : "Добавить"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateEvent;
