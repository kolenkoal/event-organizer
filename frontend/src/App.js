import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/Navbar";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from "./index";
import { check } from "./http/userApi";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const App = observer(() => {
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        check()
            .then(({ isFound, userData }) => {
                if (isFound) {
                    user.setUser(userData);
                    user.setIsAuth(isFound);
                    user.setToken(localStorage.getItem("token"));
                } else {
                    user.setUser({});
                    user.setIsAuth(isFound);
                    user.setToken("");
                }
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <Spinner animation={"grow"} />;
    }

    return (
        <BrowserRouter className="App">
            <NavBar />
            <AppRouter />
        </BrowserRouter>
    );
});

export default App;
