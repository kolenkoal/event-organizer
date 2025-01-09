import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Test from "./pages/Test";
import EventPage from "./pages/EventPage";
import Profile from "./pages/Profile";
import {
    EVENTS_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
    TEST_ROUTE,
    EVENT_ROUTE,
    PROFILE_ROUTE,
    REQUESTS_ROUTE,
} from "./utils/consts";
import { Component } from "react";
import Requests from "./pages/Requests";

export const authRoutes = [];

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: <Auth />,
    },
    {
        path: REGISTRATION_ROUTE,
        Component: <Auth />,
    },
    {
        path: TEST_ROUTE,
        Component: <Test word={"Wow"} />,
    },
    {
        path: EVENTS_ROUTE,
        Component: <Events />,
    },
    {
        path: EVENT_ROUTE + "/:id",
        Component: <EventPage />,
    },
    {
        path: PROFILE_ROUTE,
        Component: <Profile />,
    },
    {
        path: REQUESTS_ROUTE,
        Component: <Requests />,
    },
];
