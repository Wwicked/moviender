import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SET_USER } from "../reducers/types";
import { removeAuthCookiesAndHeader } from "../services/api";
import Profile from "./Profile/Profile";
import SettingsModal from "./SettingsModal/SettingsModal";

const NavLoggedIn = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showSettings, setShowSettings] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const handleClickHome = () => navigate("/");
    const handleClickNewMovie = () => navigate("/admin/new");
    const handleClickSwipe = () => navigate("/");
    const handleClickProfile = () => setShowProfile(true);
    const handleCloseProfile = () => setShowProfile(false);
    const handleClickSettings = () => setShowSettings(true);
    const handleCloseSettings = () => setShowSettings(false);
    const handleClickLogOut = () => {
        removeAuthCookiesAndHeader();
        dispatch({
            type: SET_USER,
            payload: null,
        });
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="md" className="mb-3">
                <Container>
                    <Navbar.Brand onClick={handleClickHome}>Moviender</Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={handleClickSwipe}>Swipe</Nav.Link>
                            {user?.is_admin && <Nav.Link onClick={handleClickNewMovie}>New Movie</Nav.Link>}
                        </Nav>

                        <Nav className="justify-content-end">
                            <Nav.Link onClick={handleClickProfile}>Profile</Nav.Link>
                            <Nav.Link onClick={handleClickSettings}>Settings</Nav.Link>
                            <Nav.Link onClick={handleClickLogOut}>Log out</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {showSettings && <SettingsModal show={showSettings} onClose={handleCloseSettings} />}
            {showProfile && <Profile show={showProfile} onClose={handleCloseProfile} />}
        </>
    );
};

const NavLoggedOut = () => {
    return <></>;
};

const CustomNav = () => {
    const { user } = useSelector((state) => state.user);

    return user ? <NavLoggedIn /> : <NavLoggedOut />;
};

export default CustomNav;
