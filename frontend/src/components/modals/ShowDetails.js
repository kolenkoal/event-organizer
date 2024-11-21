import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AddEvent, FetchEvent } from "../../http/EventApi";
import { Context } from "../..";
import { useContext } from "react";

const ShowDetails = ({ show, onHide, details }) => {
    const { user, event } = useContext(Context);
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Описание мероприятия
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{details}</Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShowDetails;
