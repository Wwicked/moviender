import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginRegisterPills from "./components/LoginRegisterPills";
import Container from "react-bootstrap/Container";

const App = () => {
    return (
        <Container>
            <Header />

            <div className="my-5">
                <LoginRegisterPills />
            </div>

            <Footer />
        </Container>
    );
};

export default App;
