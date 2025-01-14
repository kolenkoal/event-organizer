import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { FetchParticipationRequests } from "../../http/EventApi";

const ShowDocuments = ({ show, handleClose, documents }) => {
    // const [documents, setDocuments] = useState([]);
    const checkedDocuments = documents ? documents : ''
    // console.log(documents)
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
                {checkedDocuments.length > 0 ? (
                    <ListGroup>
                        {/* {documents.map((doc, index) => ( */}
                        <ListGroup.Item>
                            <a
                                href={checkedDocuments}
                                download
                                className="text-decoration-none"
                            >
                                {extractAfterLastSlash(checkedDocuments)} (Скачать)
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
