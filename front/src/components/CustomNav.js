import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeAuthCookiesAndHeader } from "../services/api";
import { SET_USER } from "../reducers/types";
import SettingsModal from "./SettingsModal/SettingsModal";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

const NavLoggedIn = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);

    const handleClickLogOut = () => {
        removeAuthCookiesAndHeader();
        dispatch({
            type: SET_USER,
            payload: null,
        });
    };

    const handleClickHome = () => navigate("/");
    const handleClickNewMovie = () => navigate("/admin/new");
    const handleClickSwipe = () => navigate("/");

    return (
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
                        <Nav.Link>
                            <FontAwesomeIcon
                                icon={faCog}
                                onClick={() => {
                                    setShowSettings(true);
                                }}
                            />

                            {showSettings && (
                                <SettingsModal
                                    show={showSettings}
                                    onClose={() => {
                                        setShowSettings(false);
                                    }}
                                />
                            )}
                        </Nav.Link>
                        <Nav.Link onClick={handleClickLogOut}>Log out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
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
