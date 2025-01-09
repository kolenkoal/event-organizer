import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { RequestParticipation } from "../../http/EventApi";

const CreateRequest = ({ show, onHide, eventId, token }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            alert("Пожалуйста, прикрепите хотя бы один документ.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`documents[${index}]`, file);
        });

        try {
            await RequestParticipation(eventId, formData, token);
            alert("Заявка успешно отправлена!");
            onHide();
        } catch (error) {
            console.error("Ошибка при отправке заявки:", error);
            alert("Ошибка при отправке заявки");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Подача заявки на участие</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formFileMultiple" className="mb-3">
                        <Form.Label>Прикрепите документы</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            onChange={handleFileChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    Отмена
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Отправка..." : "Отправить заявку"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateRequest;
