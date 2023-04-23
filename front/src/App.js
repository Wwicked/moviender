import React from "react";
import Container from "react-bootstrap/Container";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
    return (
        <Container className="my-5">
            <Login />
            <Register />
        </Container>
    );
};

export default App;
