import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastAlert = ({
    message,
    variant = "primary",
    onClose,
    duration = 3000,
}) => {
    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast bg={variant} onClose={onClose} delay={duration} autohide>
                <Toast.Header>
                    <strong className="me-auto">Уведомление</strong>
                    <small>Сейчас</small>
                </Toast.Header>
                <Toast.Body className="text-white">{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastAlert;
