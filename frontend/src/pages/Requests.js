import React, { useEffect, useState } from "react";
import {
    FetchParticipationRequests,
    FetchCreatedEvents,
    getUserEvents,
    HandleParticipationRequest,
} from "../http/EventApi";
import {
    Container,
    ListGroup,
    Dropdown,
    Card,
    Spinner,
    Alert,
    Button,
} from "react-bootstrap";
import ShowDocuments from "../components/modals/ShowDocuments";

const RequestsPage = ({ userId }) => {
    const [adminRequests, setAdminRequests] = useState([]); // Заявки на мои события (админ)
    const [userRequests, setUserRequests] = useState([]); // Мои заявки на участие
    const [createdEvents, setCreatedEvents] = useState([]); // Созданные мероприятия
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedList, setSelectedList] = useState("userRequests"); // Выбранный список
    const [showDocumentsModal, setShowDocumentsModal] = useState(false); // Состояние для отображения
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        setLoading(true);

        // Загружаем мероприятия, созданные пользователем (если он админ)
        FetchCreatedEvents()
            .then((data) => {
                setCreatedEvents(data.events);
                return Promise.all(
                    data.events.map((event) =>
                        FetchParticipationRequests(event.id)
                    )
                );
            })
            .then((allRequests) => {
                setAdminRequests(allRequests.flat());
            })
            .catch((err) => setError(err.message));

        // Загружаем заявки пользователя на участие в мероприятиях
        getUserEvents()
            .then((data) => setUserRequests(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleUpdateStatus = (eventId, userId, newStatus) => {
        try {
            HandleParticipationRequest(eventId, userId, newStatus);

            // Обновляем заявки для администраторского просмотра
            setAdminRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.user_id === userId ? { ...req, status: newStatus } : req
                )
            );
        } catch (error) {
            console.error("Ошибка обновления статуса:", error);
        }
    };

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto mt-4" />;
    }

    if (error) {
        return (
            <Alert variant="danger" className="mt-4">
                {error}
            </Alert>
        );
    }

    const handleViewDocuments = (documentsList) => {
        setDocuments(documentsList); // Обновляем список документов для этой заявки
        setShowDocumentsModal(true); // Открываем модальное окно
    };

    const handleCloseDocumentsModal = () => {
        setShowDocumentsModal(false); // Закрываем модальное окно
        setDocuments([]); // Очищаем список документов
    };

    const getDropdownText = () => {
        switch (selectedList) {
            case "adminRequests":
                return "Заявки на мои мероприятия";
            case "userRequests":
                return "Мои заявки на участие";
            default:
                return "Выберите категорию";
        }
    };

    const requests =
        selectedList === "adminRequests"
            ? adminRequests
            : selectedList === "userRequests"
            ? userRequests
            : [];
    console.log(requests)
    return (
        <Container className="mt-4">
            <h2 className="mb-4 text-center">Заявки на участие</h2>

            {/* Меню выбора категории заявок */}
            <Dropdown className="mb-4">
                <Dropdown.Toggle variant="primary">
                    {getDropdownText()}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item
                        onClick={() => setSelectedList("adminRequests")}
                    >
                        Заявки на мои мероприятия
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => setSelectedList("userRequests")}
                    >
                        Мои заявки на участие
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {/* Список заявок */}
            {selectedList && (
                <>
                    <h4 className="mt-4 text-center">
                        {selectedList === "adminRequests"
                            ? "Заявки на мои мероприятия"
                            : "Мои заявки на участие"}
                    </h4>

                    {requests.length > 0 ? (
                        <ListGroup className="mt-3">
                            {requests.map((req) => (
                                <Card key={req.id} className="mb-3 shadow-sm">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <Card.Title>
                                                {selectedList ===
                                                "adminRequests"
                                                    ? req.user.first_name + ' ' + req.user.last_name
                                                    : req.event_id}
                                            </Card.Title>
                                            <Card.Text>
                                                {selectedList ===
                                                    "adminRequests"
                                                        ? req.user.email 
                                                        : req.event_id}
                                            </Card.Text>
                                            <Card.Text
                                                className={`text-${
                                                    req.status === "APPROVED"
                                                        ? "success"
                                                        : req.status ===
                                                          "REJECTED"
                                                        ? "danger"
                                                        : "warning"
                                                }`}
                                            >
                                                Статус: {req.status}
                                            </Card.Text>
                                        </div>

                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                handleViewDocuments(
                                                    req.documents || []
                                                )
                                            }
                                        >
                                            Просмотреть документы
                                        </Button>
                                        <ShowDocuments
                                            show={showDocumentsModal}
                                            handleClose={
                                                handleCloseDocumentsModal
                                            }
                                            eventId={req.event_id}
                                        />
                                        {/* Действия администратора */}
                                        {selectedList === "adminRequests" &&
                                            req.status === "PENDING" && (
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant="secondary"
                                                        size="sm"
                                                    >
                                                        Действия
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    req.event_id,
                                                                    req.user_id,
                                                                    "APPROVED"
                                                                )
                                                            }
                                                        >
                                                            Подтвердить
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    req.event_id,
                                                                    req.user_id,
                                                                    "REJECTED"
                                                                )
                                                            }
                                                        >
                                                            Отклонить
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    req.event_id,
                                                                    req.user_id,
                                                                    "CANCELED"
                                                                )
                                                            }
                                                        >
                                                            Закрыть
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            )}
                                    </Card.Body>
                                </Card>
                            ))}
                        </ListGroup>
                    ) : (
                        <p className="mt-3 text-center">Список пуст</p>
                    )}
                </>
            )}
        </Container>
    );
};

export default RequestsPage;
