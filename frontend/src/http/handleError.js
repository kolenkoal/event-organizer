import axios from "axios";

const UNIQUE_MESSAGES = {
    "REGISTER_INVALID_PASSWORD": "Неверный пароль при регистрации",
    "REGISTER_USER_ALREADY_EXISTS": "Пользователь уже существует",
    "OAUTH_NOT_AVAILABLE_EMAIL": "Email недоступен для OAuth",
    "OAUTH_USER_ALREADY_EXISTS": "Пользователь уже зарегистрирован через OAuth",
    "LOGIN_BAD_CREDENTIALS": "Неверные учетные данные",
    "LOGIN_USER_NOT_VERIFIED": "Пользователь не верифицирован",
    "RESET_PASSWORD_BAD_TOKEN": "Неверный токен для сброса пароля",
    "RESET_PASSWORD_INVALID_PASSWORD": "Неверный новый пароль",
    "VERIFY_USER_BAD_TOKEN": "Неверный токен подтверждения",
    "VERIFY_USER_ALREADY_VERIFIED": "Пользователь уже подтвержден",
    "UPDATE_USER_EMAIL_ALREADY_EXISTS": "Email уже используется",
    "UPDATE_USER_INVALID_PASSWORD": "Неверный текущий пароль"
}

export const handleRequestError = (error) => {
    console.log(error.response.statusText)
    if (axios.isAxiosError(error)) {
        const errorDetail = error.response?.data?.detail;

        if (errorDetail && UNIQUE_MESSAGES[errorDetail]) {
            alert(`${error.request.status || 'Ошибка'}: ${UNIQUE_MESSAGES[errorDetail]}`, ); 
        } else {
            alert(`${error.request.status || "Ошибка"}: ${errorDetail || 'Неизвестная ошибка' }`);
        }
    } else {
        alert("Unexpected Error:", error);
    }
};
