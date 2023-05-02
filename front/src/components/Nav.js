import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeAuthCookiesAndHeader } from "../services/api";
import { SET_USER } from "../reducers/types";

const NavLoggedIn = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const onLogOut = () => {
        removeAuthCookiesAndHeader();
        dispatch({
            type: SET_USER,
            payload: null,
        });
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
                        <Nav.Link href="#">
                            <Link to="/admin/new" replace>
                                New movie
                            </Link>
                        </Nav.Link>
                    </Nav>
                    <Form className="d-flex gap-3">
                        <Navbar.Text>
                            Hello, <a href="#login">{user?.username}</a>
                        </Navbar.Text>
                        <Nav.Link href="#" onClick={onLogOut}>
                            Log out
                        </Nav.Link>
                    </Form>
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
