import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginRegisterPills from "./components/LoginRegisterPills";
import Container from "react-bootstrap/Container";

const App = () => {
    return (
        <Container>
            <Header />
            <LoginRegisterPills />
            <Footer />
        </Container>
    );
};

export default App;
