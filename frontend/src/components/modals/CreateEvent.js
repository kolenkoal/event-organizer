import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AddEvent, PatchEvent } from "../../http/EventApi";
import { Context } from "../..";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import { EVENTS_ROUTE } from "../../utils/consts";

const CreateEvent = observer(({ show, onHide, eventInfo }) => {
    const { user, event } = useContext(Context);
    const navigate = useNavigate()
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const [errors, setErrors] = useState({});

    // Функция валидации
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
    // console.log(eventInfo)
    useEffect(() => {
        if (eventInfo) {
            console.log(eventInfo)
            setTitle(eventInfo.title || "");
            setStartDate(eventInfo.start_time ? formatDateForInput(eventInfo.start_time) : "");
            setEndDate(eventInfo.end_time ? formatDateForInput(eventInfo.end_time) : "");
            setDescription(eventInfo.description || "");
            setLocation(eventInfo.location || "");
        } else {
            setTitle("");
            setStartDate("");
            setEndDate("");
            setDescription("");
            setLocation("");
        }
    }, [eventInfo]);

    const formatDateForInput = (date) => {
        if (!date) return "";
        const localDate = new Date(date);
        const utcOffset = localDate.getTimezoneOffset();
        localDate.setMinutes(localDate.getMinutes() - utcOffset);
        return localDate.toISOString().slice(0, 16);
    };

    const addEvent = async () => {
        if (!validateFields()) return;

        const parsedStartDatetime = new Date(startDate);
        const parsedEndDatetime = new Date(endDate);
        const eventData = {
            title,
            description,
            start_time: parsedStartDatetime.toISOString(),
            end_time: parsedEndDatetime.toISOString(),
            location,
            requires_participants: isChecked,
        };

        try {
            if (eventInfo) {
                await PatchEvent(eventData, eventInfo.id, user.token);
            } else {
                await AddEvent(eventData, user.token).then((data) => {
                    event.addEvent(data)
                });
                setTitle("");
                setStartDate("");
                setEndDate("");
                setDescription("");
                setLocation("");
            }
            onHide();
        } catch (error) {
            console.error("Ошибка сохранения события:", error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{eventInfo ? "Редактировать мероприятие" : "Добавить мероприятие"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Название мероприятия</Form.Label>
                        <Form.Control
                            className={errors.title ? "is-invalid" : ""}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Введите название мероприятия"
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

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="private-event-switch"
                            label="Будут выступающие"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрыть
                </Button>
                <Button variant="outline-success" onClick={addEvent}>
                    {eventInfo ? "Обновить" : "Добавить"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateEvent;
