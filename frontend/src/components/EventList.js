import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import EventItem from "./EventItem";
import { FetchEvent } from "../http/EventApi";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const EventList = observer(() => {
    const { event } = useContext(Context);
    return (
        <Container
            style={{
                marginTop: "10px",
            }}
        >
            {event.events.map((event) => (
                <EventItem key={event.id} event={event} />
            ))}
        </Container>
    );
});

export default EventList;
