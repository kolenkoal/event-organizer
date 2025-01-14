import React, { useState } from "react";
import { Offcanvas, ListGroup, Button, ToggleButtonGroup, ToggleButton } from "react-bootstrap";

const ParticipantsSidebar = ({ show, handleClose, participants }) => {
    const [viewMode, setViewMode] = useState("listeners"); // "listeners" или "participants"
    // console.log(participants)
    // Фильтруем участников по их роли
    const listeners = participants.filter((p) => p.role === "listener");
    const activeParticipants = participants.filter((p) => p.role === "participant");
    // console.log(participants[0].user.first_name)
    return (
        <Offcanvas show={show} onHide={handleClose} backdrop={false} placement="start">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                    {viewMode === "listeners"
                        ? `Слушатели (${participants.length})`
                        : `Участники (${activeParticipants.length})`}
                </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                {/* Переключатель режимов */}
                <ToggleButtonGroup type="radio" name="viewMode" value={viewMode} onChange={setViewMode} className="w-100 mb-3">
                    <ToggleButton id="btn-listeners" variant="outline-primary" value="listeners">
                        Слушатели ({participants.length})
                    </ToggleButton>
                    <ToggleButton id="btn-participants" variant="outline-success" value="participants">
                        Участники ({activeParticipants.length})
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* Список участников */}
                <ListGroup>
                    {viewMode === "listeners" && participants.length > 0 ? (
                        participants.map((participant, index) => (
                            <ListGroup.Item key={index}>
                                {participant.user ? participant.user.first_name : ''} {participant?.user ? participant?.user.last_name : ''}
                            </ListGroup.Item>
                        ))
                    ) : viewMode === "participants" && activeParticipants.length > 0 ? (
                        activeParticipants.map((participant, index) => (
                            <ListGroup.Item key={index}>
                                {/* {participant.user.first_name} {participant.user.last_name} */}
                            </ListGroup.Item>
                        ))
                    ) : (
                        <p className="text-muted text-center mt-2">
                            {viewMode === "listeners" ? "Слушателей пока нет" : "Участников пока нет"}
                        </p>
                    )}
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ParticipantsSidebar;
