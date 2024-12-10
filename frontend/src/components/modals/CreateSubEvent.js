import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AddSubEvent, PatchEvent } from "../../http/EventApi"; // Предполагается, что есть функции для работы с подмероприятиями
import { Context } from "../..";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

const CreateSubEvent = observer(
    ({ show, onHide, parentEventId, subevent_ }) => {
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
            if (subevent_) {
                setTitle(subevent_.title);
                setStartDate(formatDateForInput(subevent_.start_time));
                setEndDate(formatDateForInput(subevent_.end_time));
                setDescription(subevent_.description);
                setLocation(subevent_.location);
            } else {
                setTitle("");
                setStartDate("");
                setEndDate("");
                setDescription("");
                setLocation("");
            }
        }, [subevent_]);

        const handleSaveSubEvent = () => {
            const parsedStartDatetime = new Date(startDate);
            const parsedEndDatetime = new Date(endDate);

            const subEventData = {
                title,
                description,
                "start_time": parsedStartDatetime.toISOString(),
                "end_time": parsedEndDatetime.toISOString(),
                location,
                "parent_event_id": parentEventId,
            };

            if (subevent_) {
                // Обновление существующего подмероприятия
                PatchEvent(subEventData, subevent_.id, user.token).then(
                    (data) => {
                        onHide();
                    }
                );
            } else {
                // Добавление нового подмероприятия
                AddSubEvent(subEventData, user.token, parentEventId).then(
                    (data) => {
                        console.log("canceled");
                        onHide();
                    }
                );
            }
        };

        return (
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {subevent_
                            ? "Редактировать подмероприятие"
                            : "Добавить подмероприятие"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Название подмероприятия</Form.Label>
                            <Form.Control
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Введите название подмероприятия"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
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
                                as="textarea"
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Введите описание"
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
                    <Button
                        variant="outline-success"
                        onClick={handleSaveSubEvent}
                    >
                        {subevent_ ? "Обновить" : "Добавить"}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
);

export default CreateSubEvent;
