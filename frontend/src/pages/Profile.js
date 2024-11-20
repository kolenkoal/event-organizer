import React, { useEffect, useState } from "react";
import { FetchCurrentEvents } from "../http/EventApi";
import EventItem from "../components/EventItem";

const Profile = () => {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        FetchCurrentEvents().then((data) => setEvents(data.events));
    }, []);

    return (
        <>
            {events.map((event) => (
                <EventItem key={event.id} event={event} />
            ))}
        </>
    );
};

export default Profile;
