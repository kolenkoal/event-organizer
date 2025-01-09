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
    getUserParticipationRequests,
} from "../http/EventApi";
import EventDetails from "../components/EventDetails";
import { PROFILE_ROUTE } from "../utils/consts";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const EventPage = observer(() => {
    const { user } = useContext(Context);
    const [event, setEvent] = useState({ info: [] });
    const [participants, setParticipants] = useState([]);
    const [subEventId, setSubEventId] = useState("");
    const [isRegisteredForSubEvent, setRegisteredForSubEvent] = useState(false);
    const [isCreator, setCreator] = useState(false);
    const [isRegistered, setRegistered] = useState(false);
    const [requestStatus, setRequestStatus] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();
    const info = {
        role: "LISTENER",
        status: "APPROVED",
        artifacts: ["string"],
    };

    useEffect(() => {
        FetchOneEvent(id).then((data) => {
            setEvent(data);
        });

        FetchCreatedEvents().then((data) =>
            data.events.map((event) => {
                event.id === id ? setCreator(true) : console.log("false");
            })
        );

        // !!!!!!!!!!!!! Нужно продумать логику, чтобы конкретные сабивенты подсвечивались, а другие нет
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

        getUserParticipationRequests(id).then((data) => {
            if (data) {
                setRequestStatus(data[0].status);
            }
        });
    }, [subEventId, id]);

    const onRegister = (eventId) => {
        if (!eventId) {
            RegisterForEvent(id, info).then((data) => {
                if (data) {
                    setRegistered(true);
                    setParticipants((prevParticipants) => [
                        ...prevParticipants,
                        { user_id: user._user.id },
                    ]);
                }
            });

            return;
        }
        console.log(eventId, "eventId");
        RegisterForEvent(eventId, info).then((data) => {
            if (data) {
                // setRegisteredForSubEvent(true);
                setParticipants((prevParticipants) => [
                    ...prevParticipants,
                    { user_id: user._user.id },
                ]);
            }
        });

        setSubEventId(eventId);
        return true;
    };

    const onDeleteItem = () => {
        DeleteEvent(id).then((data) => {
            alert("Удалено");
            navigate(PROFILE_ROUTE);
        });
    };

    const onUnregister = (eventId) => {
        if (!eventId) {
            UnregisterFromEvent(user._user.id, id).then((data) => {
                setRegistered(false);
                setParticipants((prevParticipants) => {
                    return prevParticipants.filter(
                        (participant) => participant.user_id !== user._user.id
                    );
                });
            });

            return;
        }

        UnregisterFromEvent(user._user.id, eventId).then((data) => {
            // setRegisteredForSubEvent(false);
            setParticipants((prevParticipants) => {
                return prevParticipants.filter(
                    (participant) => participant.user_id !== user._user.id
                );
            });
        });

        setSubEventId(eventId);
        return true;
    };

    return (
        <EventDetails
            event={event}
            requestStatus={requestStatus}
            userId={user._user.id}
            isRegisteredForSubEvent={isRegisteredForSubEvent}
            onRegister={onRegister}
            isCreator={isCreator}
            isRegistered={isRegistered}
            onDeleteItem={onDeleteItem}
            onUnregister={onUnregister}
            participants={participants}
            setRegisteredForSubEvent={setRegisteredForSubEvent}
        />
    );
});

export default EventPage;
