import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { RequestParticipation } from "../../http/EventApi";

const CreateRequest = ({ show, onHide, eventId, token, onRegisterLikeParticipant }) => {
    const [selectedFile, setSelectedFile] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            // setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;
        // if (files.length === 0) {
        //     alert("Пожалуйста, прикрепите хотя бы один документ.");
        //     return;
        // }

        setLoading(true);
        const formData = new FormData();
        // files.forEach((file, index) => {
        //     formData.append(`documents[${index}]`, file);
        // });
        formData.append("artifacts", selectedFile);
        try {
            // const fileName = files[0].name
            // console.log(selectedFile);
            onRegisterLikeParticipant(eventId, formData)
            // const pathName = output.artifacts[0];
            // localStorage.setItem(`eventDocument_${eventId}`, pathName);
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
