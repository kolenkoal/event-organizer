import { useState, useEffect } from "react";
import { Button, Badge } from "react-bootstrap";

// Пример статусов заявки
const STATUS_COLORS = {
    PENDING: "warning", // Ожидание
    APPROVED: "success", // Подтверждена
    REJECTED: "danger", // Отклонена
};

const RequestStatus = ({ requestStatus }) => {
    return (
        <>
            {requestStatus !== "" && (
                <div className="mt-3">
                    <h5>Статус вашей заявки:</h5>
                    <Badge bg={STATUS_COLORS[requestStatus]}>
                        {requestStatus === "PENDING" && "Ожидает рассмотрения"}
                        {requestStatus === "APPROVED" && "Одобрена"}
                        {requestStatus === "REJECTED" && "Отклонена"}
                    </Badge>
                </div>
            )}
        </>
    );
};

export default RequestStatus;
