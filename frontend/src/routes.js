import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Test from "./pages/Test";
import EventPage from "./pages/EventPage";
import {
    EVENTS_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
    TEST_ROUTE,
    EVENT_ROUTE,
} from "./utils/consts";

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
];
