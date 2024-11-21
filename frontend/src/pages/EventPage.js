import React, { useContext, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";
import {
    DeleteEvent,
    FetchCreatedEvents,
    FetchCurrentEvents,
    FetchEventParticipants,
    FetchOneEvent,
    RegisterForEvent,
    UnregisterFromEvent,
} from "../http/EventApi";
import EventDetails from "../components/EventDetails";
import { PROFILE_ROUTE } from "../utils/consts";
import { Context } from "..";

const EventPage = () => {
    const { user } = useContext(Context);
    const [event, setEvent] = useState({ info: [] });
    const [participants, setParticipants] = useState([]);
    const [isCreator, setCreator] = useState(false);
    const [isRegistered, setRegistered] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        FetchOneEvent(id).then((data) => setEvent(data));
        FetchCreatedEvents().then((data) =>
            data.events.map((event) => {
                event.id === id ? setCreator(true) : console.log("false");
            })
        );
        FetchCurrentEvents().then((data) => {
            data.events.map((event) => {
                event.id === id
                    ? setRegistered(true)
                    : console.log("Event page Current Events", "false");
            });
        });
        FetchEventParticipants(id).then((data) => {
            setParticipants(data.participants);
        });
    }, []);

    const onRegister = () => {
        RegisterForEvent(id).then((data) => {
            if (data && data.status === "registered") {
                setRegistered(true);
            }
        });
    };

    const onDeleteItem = () => {
        DeleteEvent(id).then((data) => {
            alert("Удалено");
            navigate(PROFILE_ROUTE);
        });
    };

    const onUnregister = () => {
        console.log(
            "userID",
            user._user.id,
            "userToken",
            user.token,
            "EventId",
            id
        );
        UnregisterFromEvent(user._user.id, id, user.token).then((data) => {
            setRegistered(false);
        });
    };

    return (
        <EventDetails
            event={event}
            onRegister={onRegister}
            isCreator={isCreator}
            isRegistered={isRegistered}
            onDeleteItem={onDeleteItem}
            onUnregister={onUnregister}
            participants={participants}
        />
    );
};

export default EventPage;
