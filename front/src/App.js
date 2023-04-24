import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ user, redirectPath = "/login" }) => {
    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

const App = () => {
    return (
        <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />

            <Route element={<ProtectedRoute user={null} />}>
                <Route exact path="/" element={<Home />} />
            </Route>
        </Routes>
    );
};

export default App;
