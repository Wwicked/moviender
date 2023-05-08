import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeAuthCookiesAndHeader } from "../services/api";
import { SET_USER } from "../reducers/types";

const NavLoggedIn = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClickLogOut = () => {
        removeAuthCookiesAndHeader();
        dispatch({
            type: SET_USER,
            payload: null,
        });
    };

    const handleClickHome = () => {
        navigate("/");
    };

    const handleClickNewMovie = () => {
        navigate("/admin/new");
    };

    return (
        <Navbar bg="dark" variant="dark" expand="md">
            <Container>
                <Navbar.Brand onClick={handleClickHome}>Home</Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        {user?.is_admin && <Nav.Link onClick={handleClickNewMovie}>New Movie</Nav.Link>}
                    </Nav>

                    <Nav className="justify-content-end">
                        <Nav.Link>Hello, {user?.username}</Nav.Link>
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
