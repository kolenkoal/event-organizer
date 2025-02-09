import React, { useEffect, useState } from "react";
import {
    FetchParticipationRequests,
    HandleParticipationRequest,
} from "../http/EventApi";
import {
    ListGroup,
    Spinner,
    Alert,
    Button,
    Dropdown,
    Offcanvas,
    Card,
} from "react-bootstrap";
import ShowDocuments from "../components/modals/ShowDocuments";

const AdminRequestsSidebar = ({ eventId, show, handleClose }) => {
    const [adminRequests, setAdminRequests] = useState([]); // Заявки на мероприятие
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        if (!eventId) return;

        setLoading(true);
        FetchParticipationRequests(eventId)
            .then((data) => setAdminRequests(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [eventId]);
    console.log(adminRequests)
    const handleUpdateStatus = (userId, newStatus) => {
        try {
            HandleParticipationRequest(eventId, userId, newStatus);
            setAdminRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.user_id === userId ? { ...req, status: newStatus } : req
                )
            );
        } catch (error) {
            console.error("Ошибка обновления статуса:", error);
        }
    };

    const handleViewDocuments = (documentsList) => {
        setDocuments(documentsList);
        setShowDocumentsModal(true);
    };

    const handleCloseDocumentsModal = () => {
        setShowDocumentsModal(false);
        setDocuments([]);
    };
    // console.log(adminRequests)
    return (
        <Offcanvas show={show} onHide={handleClose} backdrop={false} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Заявки на участие</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {loading ? (
                    <Spinner animation="border" className="d-block mx-auto mt-4" />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : adminRequests.length > 0 ? (
                    <ListGroup>
                        {adminRequests.map((req) => (
                            <Card key={req.artifacts} className="mb-3 shadow-sm">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Card.Title>{"Name Surname"}</Card.Title>
                                        <Card.Text
                                            className={`text-${
                                                req.status === "APPROVED"
                                                    ? "success"
                                                    : req.status === "REJECTED"
                                                    ? "danger"
                                                    : "warning"
                                            }`}
                                        >
                                            Статус: {req.status}
                                        </Card.Text>
                                    </div>

                                    <Button variant="link" onClick={() => {
                                        if(req.artifacts) {handleViewDocuments(req.artifacts[0])}
                                    }}>
                                        📄 Документы
                                    </Button>
                                    

                                    {req.status === "PENDING" && (
                                        <Dropdown>
                                            <Dropdown.Toggle variant="secondary" size="sm">
                                                Действия
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleUpdateStatus(req.user_id, "APPROVED")}>
                                                    ✅ Подтвердить
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleUpdateStatus(req.user_id, "REJECTED")}>
                                                    ❌ Отклонить
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleUpdateStatus(req.user_id, "CANCELED")}>
                                                    🔒 Закрыть
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </Card.Body>
                            </Card>
                        ))}
                    </ListGroup>
                ) : (
                    <p className="text-center mt-3">Заявок пока нет</p>
                )}

            <ShowDocuments show={showDocumentsModal} handleClose={handleCloseDocumentsModal} documents={documents} />
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default AdminRequestsSidebar;
