import { $authHost, $host } from "./index";
import { useContext } from "react";
import { Context } from "..";

export const AddEvent = async (eventData, token) => {
    const { data } = await $authHost.post("api/v1/events", eventData, {
        headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return data;
};

export const FetchEvents = async () => {
    const { data } = await $host.get("api/v1/events/all");
    console.log(data);
    return data;
};

export const FetchOneEvent = async (id) => {
    const { data } = await $host.get("api/v1/events/" + id);
    return data;
};

export const RegisterForEvent = async (id) => {
    const { data } = await $authHost.post(
        "api/v1/events/" + id + "/register",
        id
    );

    return data;
};

export const FetchCurrentEvents = async () => {
    const { data } = await $authHost.get("api/v1/events/my/participate");

    return data;
};

export const FetchCreatedEvents = async () => {
    const { data } = await $authHost.get("api/v1/events/my/organize");

    return data;
};

export const PatchEvent = async (eventData, id, token) => {
    const { data } = await $authHost.patch("api/v1/events/" + id, eventData, {
        headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    return data;
};

export const DeleteEvent = async (id) => {
    const { data } = await $authHost.delete("api/v1/events/" + id);

    return data;
};
