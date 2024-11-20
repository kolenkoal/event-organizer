import React, { useContext, useState } from "react";
import { Context } from "../index";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { EVENTS_ROUTE, LOGIN_ROUTE } from "../utils/consts";
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
              <Button
                variant="outline-light"
                onClick={() => {
                  logOut();
                }}
                style={{ marginLeft: "4px" }}
              >
                Выйти
              </Button>
              {/* <Nav
            className="ml-auto"
            style={{ color: "white", margin: "0 0 0 auto" }}
          > */}
              <Button onClick={() => setEventVisible(true)}>
                Создать мероприятие
              </Button>
              <CreateEvent
                show={eventVisible}
                onHide={() => setEventVisible(false)}
              />
              {/* </Nav> */}
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
