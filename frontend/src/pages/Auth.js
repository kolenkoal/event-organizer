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
    const [isSuccess, setSuccess] = useState(false);
    
    const click = async () => {
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
                if (data) {
                    user.setUser(user);
                    user.setIsAuth(true);
                    user.setToken(data);
                    navigate(EVENTS_ROUTE);
                }
            } else {
                data = await registration(email, password);
                if (data) {
                    setSuccess(true);
                    alert("Вы зарегистрировались !");
                    navigate(LOGIN_ROUTE);
                }
            }
        } catch (e) {
            alert(e.response.data.message);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 54 }}
        >
            {/* {isSuccess && <ToastAlert message={"Вы зарегистрировались !"} />} */}
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">
                    {isLogin ? "Авторизация" : "Регистрация"}
                </h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш Email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    />
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ? (
                            <div className="align-self-start">
                                Нет Аккаунта ?{" "}
                                <NavLink to={REGISTRATION_ROUTE}>
                                    Зарегистрируйся
                                </NavLink>
                            </div>
                        ) : (
                            <div className="align-self-start">
                                Есть аккаунт ?{" "}
                                <NavLink to={LOGIN_ROUTE}>Войдите</NavLink>
                            </div>
                        )}
                        <Button
                            className="mt-3 align-self-end"
                            variant="outline-success"
                            onClick={click}
                        >
                            {isLogin ? "Войти" : "Регистрация"}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;
