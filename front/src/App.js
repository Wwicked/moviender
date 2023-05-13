import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewMovie from "./pages/NewMovie";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Register";
import { SET_ALL_GENRES, SET_USER } from "./reducers/types";
import UserService from "./services/user.service";
import CustomNav from "./components/CustomNav";
import { removeAuthCookiesAndHeader } from "./services/api";
import CustomFooter from "./components/CustomFooter/CustomFooter";
import CenteredSpinner from "./components/CenteredSpinner";
import GenreService from "./services/genre.service";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
    const { user } = useSelector((state) => state.user);

    if (!user) {
        removeAuthCookiesAndHeader();
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

const AdminRoute = ({ redirectPath = "/" }) => {
    const { user } = useSelector((state) => state.user);

    if (!user?.is_admin) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

const App = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState({
        user: true,
        genres: true,
    });

    useEffect(() => {
        setLoading({
            user: true,
            genres: true,
        });

        GenreService.getAll()
            .then((res) => {
                dispatch({
                    type: SET_ALL_GENRES,
                    payload: res.data,
                });

                setLoading((prev) => ({ ...prev, genres: false }));
            })
            .catch((err) => {
                setLoading((prev) => ({ ...prev, genres: false }));
            });

        const token = Cookies.get("access_token");

        if (!token || user) {
            setLoading((prev) => ({ ...prev, user: false }));
            return;
        }

        console.log(`Token: ${token} User: ${JSON.stringify(user)}`);

        UserService.read()
            .then((res) => {
                dispatch({
                    type: SET_USER,
                    payload: res.data,
                });

                setLoading((prev) => ({ ...prev, user: false }));
            })
            .catch((err) => {
                setLoading((prev) => ({ ...prev, user: false }));
                navigate("/login");
            });
    }, [dispatch, navigate, user]);

    if (loading?.user || loading?.genres) {
        return <CenteredSpinner />;
    }

    return (
        <>
            <CustomNav />

            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route exact path="/" element={<Home />} />

                    <Route element={<AdminRoute />}>
                        <Route exact path="/admin/new" element={<NewMovie />} />
                    </Route>
                </Route>

                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>

            <CustomFooter />
        </>
    );
};

export default App;
