import { handleRequestError } from "./handleError";
import { $authHost, $host } from "./index";

export const registration = async (email, password) => {
    try {
        const { data } = await $host.post("api/v1/auth/register", {
            email,
            password,
            is_active: true,
            is_superuser: false,
            is_verified: false,
            first_name: "string",
            last_name: "string",
        });
        return data;
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};

export const login = async (email, password) => {
    try {
        const enteredData = new URLSearchParams();
        enteredData.append("grant_type", "password");
        enteredData.append("username", email);
        enteredData.append("password", password);
        enteredData.append("scope", "");
        enteredData.append("client_id", "string");
        enteredData.append("client_secret", "string");

        const { data } = await $host.post("api/v1/auth/login", enteredData, {
            headers: {
                accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        localStorage.setItem("token", data.access_token);
        return data.access_token;
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};

export const check = async () => {
    try {
        const { data } = await $authHost.get("api/v1/users/me");
        if (!data)
            return {
                isFound: false,
                userData: [],
            };

        return {
            isFound: true,
            userData: data,
        };
    } catch (error) {
        // handleRequestError(error);
        // throw error;
    }
};

export const logout = async () => {
    try {
        const { data } = await $authHost.post("api/v1/auth/logout");

        console.log("logout", data);
    } catch (error) {
        handleRequestError(error);
        // throw error;
    }
};
