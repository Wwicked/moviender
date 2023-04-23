import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Alert from "react-bootstrap/Alert";
import AuthService from "../services/auth.service";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Spinner from "react-bootstrap/Spinner";

const MIN_NAME = 2;
const MAX_NAME = 25;

const MIN_PASS = 4;
const MAX_PASS = 32;

const schema = yup
    .object()
    .shape({
        username: yup
            .string()
            .min(MIN_NAME, `Username needs to be at least ${MIN_NAME} characters long.`)
            .max(MAX_NAME, `Username needs to be at most ${MAX_NAME} characters long.`)
            .required("Username is required"),
        password: yup
            .string()
            .min(MIN_PASS, `Password needs to be at least ${MIN_PASS} characters long.`)
            .max(MAX_PASS, `Password needs to be at most ${MAX_PASS} characters long.`)
            .required("Password is required"),
        confirm_password: yup.string().oneOf([yup.ref("password"), null], "Passwords must match"),
    })
    .required();

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [registerError, setRegisterError] = useState(false);
    const [registerErrorMessage, setRegisterErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: "",
            password: "",
            confirm_password: "",
        },
        resolver: yupResolver(schema),
    });

    const submitForm = async (data) => {
        AuthService.register(data.username, data.password)
            .then((res) => {
                setLoading(true);

                // TODO: Log user in after registering
                console.log(`Register response: ${JSON.stringify(res.data)}`);

                setLoading(false);
            })
            .catch((err) => {
                setRegisterError(true);
                setRegisterErrorMessage("Unknown error occured. Please try again.");

                if (err.response) {
                    if (err.response.status === 409) {
                        setRegisterErrorMessage("User with that username already exists.");
                    }
                } else if (err.request) {
                    setRegisterErrorMessage("Client-side error. Please try again.");
                }

                setLoading(false);
            });
    };

    return (
        <Container>
            <Container className="d-flex align-items-center h-custom-2 justify-content-center">
                <Form
                    style={{ width: "23rem" }}
                    onSubmit={handleSubmit(submitForm)}
                    onChange={() => {
                        setRegisterError(false);
                        setRegisterErrorMessage("");
                    }}
                >
                    <Col>
                        {registerError && (
                            <Row className="my-4">
                                <Alert variant="danger">{registerErrorMessage}</Alert>
                            </Row>
                        )}

                        <Row className="my-4">
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    className={`form-control form-control-lg ${errors?.username && "is-invalid"}`}
                                    disabled={loading}
                                    {...register("username")}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errors?.username?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="my-4">
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    className={`form-control form-control-lg ${errors?.password && "is-invalid"}`}
                                    disabled={loading}
                                    {...register("password")}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errors?.password?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="my-4">
                            <Form.Group>
                                <Form.Label>Confirm password</Form.Label>
                                <Form.Control
                                    type="password"
                                    className={`form-control form-control-lg ${
                                        (errors?.confirm_password || errors?.password) && "is-invalid"
                                    }`}
                                    disabled={loading}
                                    {...register("confirm_password")}
                                />

                                <Form.Control.Feedback type="invalid">
                                    {errors?.confirm_password?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="my-5">
                            <Button
                                className="btn-block"
                                variant="primary"
                                size="medium"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <Spinner animation="border" variant="light" size="sm" /> : "Register"}
                            </Button>
                        </Row>
                    </Col>
                </Form>
            </Container>
        </Container>
    );
};

export default Register;
