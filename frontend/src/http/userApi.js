import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password) => {
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
};

export const login = async (email, password) => {
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
};

export const check = async () => {
    try {
        const { data } = await $authHost.get("api/v1/users/me");
        console.log("check", data);
        if (!data)
            return {
                isFound: false,
                userData: [],
            };

        return {
            isFound: true,
            userData: data,
        };
    } catch (e) {
        console.log(e.message);
    }
};

export const logout = async () => {
    const { data } = await $authHost.post("api/v1/auth/logout");

    console.log("logout", data);
};
