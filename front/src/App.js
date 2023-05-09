import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewMovie from "./pages/NewMovie";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Register";
import { SET_USER } from "./reducers/types";
import UserService from "./services/user.service";
import CustomNav from "./components/CustomNav";
import TestPage from "./pages/TestPage";
import { removeAuthCookiesAndHeader } from "./services/api";
import CustomFooter from "./components/CustomFooter";
import CenteredSpinner from "./components/CenteredSpinner";

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
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(["user"]);

    useEffect(() => {
        setLoading(true);

        if (!cookies?.access_token || user) {
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
                navigate("/login");
            });
    }, [dispatch, cookies?.access_token, navigate, user]);

    if (loading) {
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
                <Route exact path="/test" element={<TestPage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>

            <CustomFooter />
        </>
    );
};

export default App;
