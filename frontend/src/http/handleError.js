import axios from "axios";

export const handleRequestError = (error) => {
    if (axios.isAxiosError(error)) {
        console.error("Request Error:", error.response?.data || error.message);
        // Можно добавить логику: вывод уведомлений, логирование и т.д.
    } else {
        console.error("Unexpected Error:", error);
    }
};
