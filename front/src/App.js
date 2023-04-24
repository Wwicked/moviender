import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
    const [cookies] = useCookies(["user"]);

    if (!cookies.access_token) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

const App = () => {
    return (
        <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
                <Route exact path="/" element={<Home />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default App;
