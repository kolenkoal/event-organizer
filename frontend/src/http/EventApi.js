import { $authHost, $host } from "./index";
import { useContext } from "react";
import { Context } from "..";
import { handleRequestError } from "./handleError";

export const AddEvent = async (eventData, token) => {
    try {
        const { data } = await $authHost.post("api/v1/events", eventData, {
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return data;
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};

export const AddSubEvent = async (eventData, token, parentEventId) => {
    try {
        const { data } = await $authHost.post(
            `api/v1/events?parent_event_id=${parentEventId}`,
            eventData,
            {
                headers: {
                    "accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return data;
    } catch (error) {
        handleRequestError(error);
    }
};

export const FetchEvents = async () => {
    try {
        const { data } = await $host.get("api/v1/events/all");
        console.log("Fetch Events", data);
        return data;
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};

export const FetchOneEvent = async (id) => {
    try {
        const { data } = await $host.get("api/v1/events/" + id);
        console.log("Fetch one event", data);
        return data;
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};

export const RegisterForEvent = async (id) => {
    try {
        const { data } = await $authHost.post(
            "api/v1/events/" + id + "/register",
            id
        );
        return data;
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};

export const FetchCurrentEvents = async () => {
    try {
        const { data } = await $authHost.get("api/v1/events/my/participate");

        return data;
    } catch (error) {
        handleRequestError(error);
    }
};

export const FetchCreatedEvents = async () => {
    try {
        const { data } = await $authHost.get("api/v1/events/my/organize");

        return data;
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};

export const PatchEvent = async (eventData, id, token) => {
    try {
        const { data } = await $authHost.patch(
            "api/v1/events/" + id,
            eventData,
            {
                headers: {
                    "accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return data;
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};

export const DeleteEvent = async (id) => {
    try {
        const { data } = await $authHost.delete("api/v1/events/" + id);

        return data;
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};

export const UnregisterFromEvent = async (userId, eventId) => {
    try {
        const { data } = await $authHost.patch(
            "api/v1/events/" + eventId + "/cancel" + `?user_id=${userId}`,
            {
                headers: {
                    "accept": "*/*",
                },
            }
        );

        return data;
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};

export const FetchEventParticipants = async (id) => {
    try {
        const { data } = await $authHost.get(
            "/api/v1/events/" + id + "/participants"
        );

        return data;
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};
