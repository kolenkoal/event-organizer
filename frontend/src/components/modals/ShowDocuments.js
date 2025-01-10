import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

const ShowDocuments = ({ show, handleClose, eventId }) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        // Загружаем документы из localStorage при открытии модала
        const storedDocuments = localStorage.getItem(
            `eventDocument_${eventId}`
        );
        setDocuments(storedDocuments.toString());
    }, [eventId, show]);

    function extractAfterLastSlash(url) {
        const parts = url.split("/"); // Разбиваем строку по '/'
        return parts[parts.length - 1]; // Возвращаем последний элемент массива
    }

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Документы</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {documents.length > 0 ? (
                    <ListGroup>
                        {/* {documents.map((doc, index) => ( */}
                        <ListGroup.Item>
                            <a
                                href={documents}
                                download
                                className="text-decoration-none"
                            >
                                {extractAfterLastSlash(documents)} (Скачать)
                            </a>
                        </ListGroup.Item>
                        {/* ))} */}
                    </ListGroup>
                ) : (
                    <p>Документы не найдены</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShowDocuments;
