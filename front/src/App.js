import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Container from "react-bootstrap/Container";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
    return (
        <Container>
            <Header />

            <div className="my-5">
                <Register />
            </div>

            <Footer />
        </Container>
    );
};

export default App;
