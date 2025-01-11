import React, { useEffect, useState } from "react";
import { FetchCurrentEvents, FetchCreatedEvents } from "../http/EventApi";
import EventItem from "../components/EventItem";
import { Container, Dropdown, ListGroup } from "react-bootstrap";

const PersonalAccount = () => {
    const [participatingEvents, setParticipatingEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    useEffect(() => {
        FetchCurrentEvents().then((data) =>
            setParticipatingEvents(data.events)
        );

        FetchCreatedEvents().then((data) => {
            setCreatedEvents(data.events);
        });
    }, []);

    // const createdEvents = [
    //     {
    //         id: 1,
    //         title: "Конференция по React",
    //         date: "2024-11-25",
    //         location: "Москва",
    //     },
    //     {
    //         id: 2,
    //         title: "Хакатон по разработке",
    //         date: "2024-12-01",
    //         location: "Санкт-Петербург",
    //     },
    // ];
    console.log("created events", createdEvents);
    const [selectedList, setSelectedList] = useState("participating");

    const getButtonText = () => {
        switch (selectedList) {
            case "created":
                return "Созданные мероприятиях";
            // case "participating":
            //     return "Учавствую в мероприятиях";
            default:
                return "Учавствую в мероприятиях";
        }
    };

    const events =
        selectedList === "created"
            ? createdEvents
            : selectedList === "participating"
            ? participatingEvents
            : [];

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Личный кабинет</h2>

            <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    {getButtonText()}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSelectedList("created")}>
                        Созданные мероприятия
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => setSelectedList("participating")}
                    >
                        Участвую в мероприятиях
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {selectedList && (
                <>
                    <h4 className="mt-4">
                        {selectedList === "created"
                            ? "Созданные мероприятия"
                            : "Мероприятия, в которых участвую"}
                    </h4>
                    {events.length > 0 ? (
                        <ListGroup className="mt-2">
                            {events.map((event) => (
                                <EventItem key={event.id} event={event} isAuth={true}/>
                            ))}
                        </ListGroup>
                    ) : (
                        <p className="mt-2">Список пуст</p>
                    )}
                </>
            )}
        </Container>
    );
};

export default PersonalAccount;


