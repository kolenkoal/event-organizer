import React, { useState } from "react";
import { Offcanvas, ListGroup, Button, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { observer } from "mobx-react-lite";

const ParticipantsSidebar = ({ show, handleClose, participants, listeners }) => {
    const [viewMode, setViewMode] = useState("listeners"); // "listeners" или "participants"
    console.log('part', participants)
    // console.log()
    // const listeners = participants.filter((p) => p.role === "listener");
    // const activeParticipants = participants.filter((p) => p.role === "participant");
    return (
        <Offcanvas show={show} onHide={handleClose} backdrop={false} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                    {viewMode === "listeners"
                        ? `Слушатели (${listeners.length})`
                        : `Участники (${participants.length})`}
                    
                </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                {/* Переключатель режимов */}
                <ToggleButtonGroup type="radio" name="viewMode" value={viewMode} onChange={setViewMode} className="w-100 mb-3">
                    <ToggleButton id="btn-listeners" variant="outline-primary" value="listeners">
                        Слушатели ({listeners.length})
                    </ToggleButton>
                    <ToggleButton id="btn-participants" variant="outline-success" value="participants">
                        Участники ({participants.length})
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* Список участников */}
                <ListGroup>
                    {viewMode === "participants" && participants.length > 0 ? (
                        participants.map((participant, index) => (
                            <ListGroup.Item key={index}>
                                {participant.user ? participant.user.first_name : ''} {participant?.user ? participant?.user.last_name : ''}
                            </ListGroup.Item>
                        ))
                    ) : viewMode === "listeners" && listeners.length > 0 ? (
                        listeners.map((listener, index) => (
                            <ListGroup.Item key={index}>
                                {listener.user ? listener.user.first_name : ''} {listener.user ? listener.user.last_name : ''}
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

export default observer(ParticipantsSidebar);
