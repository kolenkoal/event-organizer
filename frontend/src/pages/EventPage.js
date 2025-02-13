import React, { useContext, useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";
import {
    DeleteEvent,
    FetchCreatedEvents,
    FetchCurrentEvents,
    FetchEventParticipants,
    FetchEvents,
    FetchOneEvent,
    RegisterForEvent,
    RequestParticipation,
    UnregisterFromEvent,
    getEventListeners,
    getEventParticipants,
    getUserParticipationRequests,
} from "../http/EventApi";
import EventDetails from "../components/EventDetails";
import { PROFILE_ROUTE } from "../utils/consts";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { getUserByID } from "../http/userApi";

const EventPage = observer(() => {
    const { user, event } = useContext(Context);
    const [eventInfo, setEventInfo] = useState({ info: [] });
    const [participants, setParticipants] = useState([]);
    const [listeners, setListeners] = useState([])
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
        const fetchData = async () => {
            try {
                // Запускаем все запросы одновременно
                const [eventData, createdEvents, currentEvents, participantsData, userRequests, allEvents, listenersData] = await Promise.all([
                    FetchOneEvent(id),
                    FetchCreatedEvents(),
                    FetchCurrentEvents(),
                    getEventParticipants(id),
                    getUserParticipationRequests(id),
                    FetchEvents(),
                    getEventListeners(id),
                ]);
                event.setEvents(allEvents.events)
                setEventInfo(eventData);
    
                // Проверяем, является ли текущий пользователь создателем события
                const isUserCreator = createdEvents.events.some(event => event.id === id);
                setCreator(isUserCreator);
    
                // Проверяем, зарегистрирован ли пользователь на это событие
                const isUserRegistered = currentEvents.events.some(event => event.id === id);
                setRegistered(isUserRegistered);
    
                setParticipants(participantsData.participants);
                setListeners(listenersData.listeners)

                // Проверяем статус запроса пользователя
                if (userRequests && userRequests.length > 0) {
                    setRequestStatus(userRequests[0].status);
                }
    
            } catch (error) {
                console.error("Ошибка при загрузке данных события:", error);
            }
        };
    
        fetchData();
    }, [id]); 
    // console.log('Events Context', event)

    const onRegister = (eventId) => {
        if (!eventId) {
            RegisterForEvent(id, info).then((data) => {
                if (data) {
                    console.log('data', data)
                    setRegistered(true);
                    console.log(user._user)
                    setListeners((prevParticipants) => [
                        ...prevParticipants,
                        {user: user._user}
                        // { user_id: user._user.id },
                    ]);
                }
            });

            return;
        }
        // console.log(eventId, "eventId");
        RegisterForEvent(eventId, info).then((data) => {
            if (data) {
                // setRegisteredForSubEvent(true);
                setListeners((prevParticipants) => [
                    ...prevParticipants,
                    {user: user._user},
                ]);
            }
        });

        setSubEventId(eventId);
        return true;
    };

    const onRegisterLikeParticipant = (eventId, formData) => {
        if(!eventId) {
            RequestParticipation(eventId, formData).then((data) => {
                setRegistered(true)
                setParticipants((prevParticipants) => [
                    ...prevParticipants,
                    {user: user._user}
                ])
            })
        }

        RequestParticipation(eventId, formData).then((data) => {
            setRegistered(true)
            setParticipants((prevParticipants) => [
                ...prevParticipants,
                {user: user._user}
            ])
        })

        return true
    }

    const onDeleteItem = () => {
        DeleteEvent(id).then((data) => {
            alert("Удалено");
            navigate(PROFILE_ROUTE);
        });
    };

    const onUnregister = (eventId) => {
        if (!eventId) {
            UnregisterFromEvent(user._user.id, id).then((data) => {
                // console.log('delete data', data)
                setRegistered(false);
                
                setListeners((prevListeners) => {
                    
                    return prevListeners.filter(
                        (listener) => listener.user.id !== user._user.id
                    );
                });
                setParticipants((prevParticipants) => {
                    
                    return prevParticipants.filter(
                        (listener) => listener.user.id !== user._user.id
                    );
                });
                
            });

            return;
        }

        UnregisterFromEvent(user._user.id, eventId).then((data) => {
            // setRegisteredForSubEvent(false);
            setListeners((prevListeners) => {
                    
                return prevListeners.filter(
                    (listener) => listener.user.id !== user._user.id
                );
            });
            setParticipants((prevParticipants) => {
                    
                return prevParticipants.filter(
                    (listener) => listener.user.id !== user._user.id
                );
            });
        });

        setSubEventId(eventId);
        return true;
    };

    return (
        <EventDetails
            eventInfo={eventInfo}
            requestStatus={requestStatus}
            userId={user._user.id}
            isRegisteredForSubEvent={isRegisteredForSubEvent}
            onRegister={onRegister}
            isCreator={isCreator}
            isRegistered={isRegistered}
            onDeleteItem={onDeleteItem}
            onUnregister={onUnregister}
            participants={participants}
            listeners={listeners}
            setRegisteredForSubEvent={setRegisteredForSubEvent}
            onRegisterLikeParticipant={onRegisterLikeParticipant}
        />
    );
});

export default EventPage;
