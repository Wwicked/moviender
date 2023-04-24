import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Container from "react-bootstrap/Container";
import Login from "./pages/Login";

const App = () => {
    return (
        <Container>
            <Header />

            <div className="my-5">
                <Login />
            </div>

            <Footer />
        </Container>
    );
};

export default App;
