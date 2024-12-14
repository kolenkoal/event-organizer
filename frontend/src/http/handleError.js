import axios from "axios";

export const handleRequestError = (error) => {
    if (axios.isAxiosError(error)) {
        alert(`${error.status} ${error.response.data.detail}`);
    } else {
        alert("Unexpected Error:", error);
    }
};
