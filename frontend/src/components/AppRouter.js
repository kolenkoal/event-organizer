import React, { useContext } from "react";
import { authRoutes, publicRoutes } from "../routes";
import { Route, Routes, Navigate } from "react-router";
import { EVENTS_ROUTE, LOGIN_ROUTE, MAIN_ROUTE } from "../utils/consts";
import { Context } from "../index";
import RequireAuth from "./RequireAuth";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
    const { user } = useContext(Context);
    return (
        <Routes>
            {authRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={
                        <RequireAuth isAuth={user.isAuth}>
                            {Component}
                        </RequireAuth>
                    }/>
                ))}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={Component} />
            ))}
            <Route path="*" element={<Navigate to={MAIN_ROUTE} replace />} />
        </Routes>
    );
});

export default AppRouter;
