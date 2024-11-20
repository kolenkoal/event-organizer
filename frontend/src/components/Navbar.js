import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Navbar, Nav, Button, Container, Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { EVENTS_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE } from "../utils/consts";
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
    console.log("NavBar", user);
    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <NavLink style={{ color: "white" }} to={EVENTS_ROUTE}>
                        Мероприятич
                    </NavLink>
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
                            {/* <Button
                                variant="outline-light"
                                onClick={() => {
                                    logOut();
                                }}
                                style={{ marginLeft: "4px" }}
                            >
                                Выйти
                            </Button>  */}
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="outline-light"
                                    id="dropdown-basic"
                                    style={{ marginLeft: "10px" }}
                                >
                                    <i className="bi bi-menu-button-wide"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
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
                                        onClick={() => navigate(PROFILE_ROUTE)}
                                    >
                                        Профиль
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => alert("Перешли куда-то")}
                                    >
                                        Куда-то
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => alert("Перешли туда-то")}
                                    >
                                        Туда-то
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => logOut()}
                                        style={{
                                            backgroundColor: "red",
                                            color: "white",
                                            fontWeight: "bold",
                                            borderRadius: "5px",
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
                                Авторизация
                            </Button>
                        </Nav>
                    )}
                </Container>
            </Navbar>
        </>
    );
});

export default NavBar;
