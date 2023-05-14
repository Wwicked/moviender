import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SET_USER } from "../reducers/types";
import { removeAuthCookiesAndHeader } from "../services/api";
import SettingsModal from "./SettingsModal/SettingsModal";
import StatsModal from "./StatsModal/StatsModal";
import WatchLaterModal from "./WatchLaterModal/WatchLaterModal";

const NavLoggedIn = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showSettings, setShowSettings] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showWatchLater, setShowWatchLater] = useState(false);

    const handleClickHome = () => navigate("/");
    const handleClickNewMovie = () => navigate("/admin/new");
    const handleClickSwipe = () => navigate("/");

    const handleClickWatchLater = () => setShowWatchLater(true);
    const handleCloseWatchLater = () => setShowWatchLater(false);

    const handleClickStats = () => setShowStats(true);
    const handleCloseStats = () => setShowStats(false);

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
                    <Navbar.Brand onClick={handleClickHome} style={{ cursor: "pointer" }}>
                        Moviender
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={handleClickSwipe}>Swipe</Nav.Link>
                            {user?.is_admin && <Nav.Link onClick={handleClickNewMovie}>New Movie</Nav.Link>}
                        </Nav>

                        <Nav className="justify-content-end">
                            <Nav.Link onClick={handleClickWatchLater}>Watch later</Nav.Link>
                            <Nav.Link onClick={handleClickStats}>Statistics</Nav.Link>
                            <Nav.Link onClick={handleClickSettings}>Settings</Nav.Link>
                            <Nav.Link onClick={handleClickLogOut}>Log out</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {showWatchLater && <WatchLaterModal show={showWatchLater} onClose={handleCloseWatchLater} />}
            {showStats && <StatsModal show={showStats} onClose={handleCloseStats} />}
            {showSettings && <SettingsModal show={showSettings} onClose={handleCloseSettings} />}
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
