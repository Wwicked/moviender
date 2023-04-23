import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Alert from "react-bootstrap/Alert";
import AuthService from "../services/auth.service";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [yupError, setYupError] = useState(null);

    const onLoginClick = async () => {
        AuthService.login(username, password)
            .then((res) => {
                setSuccess(true);
            })
            .catch((err) => {
                setLoginError("Unknown error occured. Please try again.");

                if (err.response) {
                    if (err.response.status === 409) {
                        setLoginError("Invalid username or password provided.");
                    }
                } else if (err.request) {
                    setLoginError("Client-side error. Please try again.");
                }
            });
    };

    return (
        <Container>
            <Container className="d-flex align-items-center h-custom-2 justify-content-center">
                <Form style={{ width: "23rem" }}>
                    <Col>
                        {loginError.length > 0 && (
                            <Row>
                                <Alert variant="danger">{loginError}</Alert>
                            </Row>
                        )}

                        <Row className="mb-4">
                            <label className="form-label" htmlFor="username-input">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username-input"
                                value={username}
                                className="form-control form-control-lg"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Row>

                        <Row>
                            <label className="form-label" htmlFor="password-input">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password-input"
                                value={password}
                                className="form-control form-control-lg"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Row>

                        <Row className="my-5">
                            <Button className="btn-primary btn-lg btn-block" onClick={onLoginClick}>
                                Login
                            </Button>
                        </Row>
                    </Col>
                </Form>
            </Container>
        </Container>
    );
};

export default Login;
