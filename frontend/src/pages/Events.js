import React, { useContext, useEffect, useState } from "react";
import EventList from "../components/EventList";
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { FetchEvents } from "../http/EventApi";

const Events = observer(() => {
    const { event } = useContext(Context);

    useEffect(() => {
        FetchEvents().then((data) => {
            event.setEvents(data.events);
        });
    }, [event]);

    return (
        <>
            <EventList />
        </>
    );
});

export default Events;
