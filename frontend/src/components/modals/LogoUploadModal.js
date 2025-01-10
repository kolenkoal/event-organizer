import { useState } from "react";
import { Button, Image, Modal, Form, Spinner } from "react-bootstrap";
import { updateLogo } from "../../http/EventApi";

const LogoUploadModal = ({ show, handleClose, setLogoUrl, eventId, token }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!selectedImage) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append("logo", selectedImage);

        try {
            const response = await updateLogo(eventId, formData, token);
            if (response?.logo_url) {
                setLogoUrl(response.logo_url);
                localStorage.setItem(`eventLogo_${eventId}`, response.logo_url);
            }
        } catch (error) {
            console.error("Ошибка загрузки логотипа:", error);
        } finally {
            setIsLoading(false);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Загрузить логотип</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {previewUrl ? (
                    <Image
                        src={previewUrl}
                        alt="Preview"
                        fluid
                        className="mb-3"
                    />
                ) : (
                    <p>Выберите изображение для логотипа</p>
                )}
                <Form.Group controlId="formFile">
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Отмена
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={!selectedImage || isLoading}
                >
                    {isLoading ? (
                        <Spinner as="span" animation="border" size="sm" />
                    ) : (
                        "Сохранить"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LogoUploadModal;
