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
            .then((data) => {
                if (data.isFound) {
                    // console.log(data)
                    user.setUser(data.userData);
                    user.setIsAuth(data.isFound);
                    user.setToken(localStorage.getItem("token"));
                } else {
                    user.setUser({});
                    user.setIsAuth(data.isFound);
                    user.setToken("");
                }
            })
            .catch((error) => {
                // console.log(error);
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
