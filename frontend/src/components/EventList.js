import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import EventItem from "./EventItem";
import { FetchEvent } from "../http/EventApi";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const EventList = observer(() => {
    const { event, user } = useContext(Context);
    const isAuth = user.isAuth;
    return (
        <Container
            style={{
                marginTop: "10px",
            }}
        >
            {event.events.map((event) => (
                <EventItem key={event.id} event={event} isAuth={isAuth} />
            ))}
        </Container>
    );
});

export default EventList;
