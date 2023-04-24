import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { SET_USER } from "./reducers/types";
import UserService from "./services/user.service";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
    const [cookies] = useCookies(["user"]);

    if (!cookies?.access_token) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

const App = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(["user"]);

    useEffect(() => {
        setLoading(true);

        if (user || !cookies?.access_token) {
            setLoading(false);
            return;
        }

        UserService.read()
            .then((res) => {
                dispatch({
                    type: SET_USER,
                    payload: res.data,
                });

                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, [dispatch, user, cookies?.access_token]);

    if (loading) {
        return (
            <Container
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                className="my-5"
            >
                <Spinner />
            </Container>
        );
    }

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
