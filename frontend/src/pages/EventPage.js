import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";
import {
    DeleteEvent,
    FetchCreatedEvents,
    FetchOneEvent,
    RegisterForEvent,
} from "../http/EventApi";
import EventDetails from "../components/EventDetails";
import { PROFILE_ROUTE } from "../utils/consts";

const EventPage = () => {
    const [event, setEvent] = useState({ info: [] });
    const [isCreator, setCreator] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        FetchOneEvent(id).then((data) => setEvent(data));
        FetchCreatedEvents().then((data) =>
            data.events.map((event) => {
                event.id === id ? setCreator(true) : console.log("false");
            })
        );
    }, []);

    const onRegister = () => {
        RegisterForEvent(id).then((data) => alert("Вы зарегистрированы"));
    };

    const onDeleteItem = () => {
        DeleteEvent(id).then((data) => {
            alert("Удалено");
            navigate(PROFILE_ROUTE);
        });
    };

    return (
        <EventDetails
            event={event}
            onRegister={onRegister}
            isCreator={isCreator}
            onDeleteItem={onDeleteItem}
        />
    );
};

export default EventPage;
