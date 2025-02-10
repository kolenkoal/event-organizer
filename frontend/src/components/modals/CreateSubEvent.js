import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AddSubEvent, PatchEvent } from "../../http/EventApi"; // Предполагается, что есть функции для работы с подмероприятиями
import { Context } from "../..";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

const CreateSubEvent = observer(
    ({ show, onHide, parentEventId, subevent, onSubEventChange }) => {
        const { user, event } = useContext(Context);
        const [title, setTitle] = useState("");
        const [startDate, setStartDate] = useState("");
        const [endDate, setEndDate] = useState("");
        const [description, setDescription] = useState("");
        const [location, setLocation] = useState("");
        const [errors, setErrors] = useState({});

        const validateFields = () => {
            const newErrors = {};
            if (!title.trim()) newErrors.title = "Заполните заголовок";
            if (!startDate.trim()) newErrors.startDate = "Заполните дату начала";
            if (!endDate.trim()) newErrors.endDate = "Заполните дату конца";
            if (!description.trim()) newErrors.description = "Заполните описание";
            if (!location.trim()) newErrors.location = "Определите место проведения";
            
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (start >= end) {
                    newErrors.endDate = "Дата окончания должна быть позже даты начала";
                }
            }
    
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

        useEffect(() => {
            if (subevent) {
                setTitle(subevent.title || '');
                setStartDate(subevent.start_time ? formatDateForInput(subevent.start_time) : "");
                setEndDate(subevent.end_time ? formatDateForInput(subevent.end_time) : "");
                setDescription(subevent.description || '');
                setLocation(subevent.location || '');
            } else {
                setTitle("");
                setStartDate("");
                setEndDate("");
                setDescription("");
                setLocation("");
            }
        }, [subevent]);

        const formatDateForInput = (date) => {
            if (!date) return "";
            const localDate = new Date(date);
            const utcOffset = localDate.getTimezoneOffset();
            localDate.setMinutes(localDate.getMinutes() - utcOffset);

            return localDate.toISOString().slice(0, 16);
        };

        

        const handleSaveSubEvent = async () => {
            console.log('click')
            if(!validateFields()) return;
            
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

            try {
                if (subevent) {
                    // Обновление существующего подмероприятия
                    await PatchEvent(subEventData, subevent.id, user.token)
                    // .then(
                    //     (data) => {
                    //         onHide();
                    //     }
                    // );
                } else {
                    // Добавление нового подмероприятия
                    await AddSubEvent(subEventData, user.token, parentEventId).then(
                        (data) => {
                            event.addSubEvent(data)
                            // onHide();
                        }
                    );
                    
                    setTitle("");
                    setStartDate("");
                    setEndDate("");
                    setDescription("");
                    setLocation("");
                    onSubEventChange()
                }
                onHide()
            } catch (error) {
                console.error("Ошибка добавления подмероприятия:", error)
            }

            
        };

        return (
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {subevent
                            ? "Редактировать подмероприятие"
                            : "Добавить подмероприятие"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Название подмероприятия</Form.Label>
                            <Form.Control
                                className={errors.title ? "is-invalid" : ""}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Введите название подмероприятия"
                            />
                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Дата начала</Form.Label>
                            <Form.Control
                                className={errors.startDate ? "is-invalid" : ""}
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Дата окончания</Form.Label>
                            <Form.Control
                                className={errors.endDate ? "is-invalid" : ""}
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                className={errors.description ? "is-invalid" : ""}
                                as="textarea"
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Введите описание"
                            />
                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Локация</Form.Label>
                            <Form.Control
                                className={errors.location ? "is-invalid" : ""}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Введите локацию"
                            />
                            {errors.location && <div className="invalid-feedback">{errors.location}</div>}
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
                        {subevent ? "Обновить" : "Добавить"}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
);

export default CreateSubEvent;
