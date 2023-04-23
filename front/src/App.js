import React from "react";
import Container from "react-bootstrap/Container";
import Register from "./Register";
import Login from "./LoginCom";

const App = () => {
    return (
        <Container className="my-5">
            <Login />
            <Register />
        </Container>
    );
};

export default App;
