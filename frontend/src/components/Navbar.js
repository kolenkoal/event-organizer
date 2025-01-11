import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Navbar, Nav, Button, Container, Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
    EVENTS_ROUTE,
    LOGIN_ROUTE,
    PROFILE_ROUTE,
    REQUESTS_ROUTE,
    PERSONAL_ACCOUNT_ROUTE
} from "../utils/consts";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import CreateEvent from "./modals/CreateEvent";

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [eventVisible, setEventVisible] = useState(false);

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
        localStorage.removeItem("token");
        navigate(LOGIN_ROUTE);
    };
    
    console.log(user._user.email)

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Button
                        variant="dark"
                        onClick={() => navigate(EVENTS_ROUTE)}
                    >
                        Мероприятия
                    </Button>
                    {user.isAuth ? (
                        <Nav
                            className="ml-auto"
                            style={{ color: "white", margin: "0 0 0 auto" }}
                        >
                            <div style={{ margin: "0 10px" }}>
                                <Button onClick={() => setEventVisible(true)}>
                                    Создать мероприятие
                                </Button>
                            </div>
                            <CreateEvent
                                show={eventVisible}
                                onHide={() => setEventVisible(false)}
                            />
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="outline-light"
                                    id="dropdown-basic"
                                    style={{ marginLeft: "10px" }}
                                >
                                    <i className="bi bi-menu-button-wide"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu
                                    style={{
                                        marginLeft: "-45px",
                                    }}
                                >
                                    <Dropdown.ItemText
                                        style={{
                                            fontWeight: "bold",
                                            color: "gray",
                                        }}
                                    >
                                        <h4>{user._user.first_name}</h4>
                                        <h6>{user._user.email}</h6>
                                    </Dropdown.ItemText>
                                    <Dropdown.Item
                                        onClick={() => navigate(PERSONAL_ACCOUNT_ROUTE)}
                                    >
                                        Личный кабинет
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => navigate(PROFILE_ROUTE)}
                                    >
                                        Профиль
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => navigate(REQUESTS_ROUTE)}
                                    >
                                        Заявки
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => logOut()}
                                        style={{
                                            backgroundColor: "red",
                                            color: "white",
                                            fontWeight: "bold",
                                            borderRadius: "5px",
                                            margin: '5px',
                                            width: '10.5rem'
                                        }}
                                    >
                                        Выйти
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    ) : (
                        <Nav
                            className="ml-auto"
                            style={{ color: "white", margin: "0 0 0 auto" }}
                        >
                            <Button
                                variant="outline-light"
                                onClick={() => navigate(LOGIN_ROUTE)}
                            >
                                Войти
                            </Button>
                        </Nav>
                    )}
                </Container>
            </Navbar>
        </>
    );
});

export default NavBar;
