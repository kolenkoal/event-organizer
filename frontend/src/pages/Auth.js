import React, { useContext, useState } from "react";
import { Container, Form, Card, Button, Row } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, EVENTS_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { login, registration } from "../http/userApi";
import { Context } from "..";
import ToastAlert from "../components/ToastAlert";

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [isSuccess, setSuccess] = useState(false);

    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};

        if (!email.trim()) newErrors.email = "Заполните email";
        if (!password.trim()) newErrors.password = "Введите пароль";

        if (!isLogin) {
            if (!name.trim()) newErrors.name = "Введите имя";
            if (!surname.trim()) newErrors.surname = "Введите фамилию";
        }

        setErrors(newErrors);
        
        return Object.keys(newErrors).length === 0;
    };
    
    const click = async () => {
        if (!validateFields()) return;

        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
                if (data) {
                    user.setUser(user);
                    user.setIsAuth(true);
                    user.setToken(data);
                    navigate(EVENTS_ROUTE);
                    localStorage.setItem('isAuth', true)
                }
            } else {
                data = await registration(email, password, name, surname);
                if (data) {
                    user.setUser(data);
                    user.setIsAuth(true);
                    localStorage.setItem('isAuth', true)
                    alert("Вы зарегистрировались !");
                    navigate(LOGIN_ROUTE);
                }
            }
        } catch (e) {
            alert(e.response?.data?.message || "Ошибка при обработке запроса");
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">{isLogin ? "Войти" : "Регистрация"}</h2>
                <Form className="d-flex flex-column">
                    {!isLogin && (
                        <>
                            <h6>Ваше имя</h6>
                            <Form.Control
                                className={`${errors.name ? "is-invalid" : ""}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}

                            <h6 className='mt-3'>Ваша фамилия</h6>
                            <Form.Control
                                className={`${errors.surname ? "is-invalid" : ""}`}
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                            {errors.surname && <div className="invalid-feedback">{errors.surname}</div>}
                        </>
                    )}
                    
                    <h6 className='mt-3'>Email</h6>
                    <Form.Control
                        className={`${errors.email ? "is-invalid" : ""}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}

                    <h6 className='mt-3'>Пароль</h6>
                    <Form.Control
                        className={`${errors.password ? "is-invalid" : ""}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}

                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ? (
                            <div className="align-self-start">
                                Еще нет аккаунта?{" "}
                                <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйтесь</NavLink>
                            </div>
                        ) : (
                            <div className="align-self-start">
                                Уже зарегистрированы?{" "}
                                <NavLink to={LOGIN_ROUTE}>Войдите</NavLink>
                            </div>
                        )}
                        <Button className="mt-3 align-self-end" variant="outline-success" onClick={click}>
                            {isLogin ? "Войти" : "Регистрация"}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;
