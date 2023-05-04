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
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/user.service";
import { SET_USER } from "../reducers/types";
import { useDispatch } from "react-redux";
import { updateAuthCookiesAndHeader } from "../services/api";

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
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        setLoading(true);

        AuthService.register(data.username, data.password)
            .then((res) => {
                updateAuthCookiesAndHeader(res?.data?.access_token, res?.data?.refresh_token);

                UserService.read()
                    .then((res) => {
                        dispatch({
                            type: SET_USER,
                            payload: res.data,
                        });

                        setLoading(false);
                        navigate("/");
                    })
                    .catch((err) => {
                        setLoading(false);
                        navigate("/login");
                    });
            })
            .catch((err) => {
                setRegisterError(true);
                setRegisterErrorMessage("Unknown error occured. Please try again.");

                if (err.response) {
                    if (err.response.status === 409) {
                        setRegisterErrorMessage("User with that username already exists.");
                    }
                } else if (err.request) {
                    setRegisterErrorMessage("Unknown error. Please try again.");
                }

                setLoading(false);
            });
    };

    return (
        <Container className="my-5 gradient-form">
            <Col
                md={5}
                lg={5}
                className="mb-5"
                style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <div className="text-center">
                    <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                        style={{ width: "185px" }}
                        alt="logo"
                    />
                </div>

                {registerError && (
                    <Row className="my-4">
                        <Alert variant="danger">{registerErrorMessage}</Alert>
                    </Row>
                )}

                <Form
                    style={{ width: "100%" }}
                    onSubmit={handleSubmit(submitForm)}
                    className="justify-content-center"
                    onChange={() => {
                        setRegisterError(false);
                        setRegisterErrorMessage("");
                    }}
                >
                    <Row className="mb-4">
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                className={`form-control form-control-lg ${errors?.username && "is-invalid"}`}
                                disabled={loading}
                                {...register("username")}
                            />

                            <Form.Control.Feedback type="invalid">{errors?.username?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-4">
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                className={`form-control form-control-lg ${errors?.password && "is-invalid"}`}
                                disabled={loading}
                                {...register("password")}
                            />

                            <Form.Control.Feedback type="invalid">{errors?.password?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-4">
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

                    <div className="text-center mb-5 mt-5">
                        <Button className="mb-4 w-100 gradient-custom-2" role="submit" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" variant="light" size="sm" /> : "Sign up"}
                        </Button>

                        <a className="text-dark" href="#!">
                            Forgot password?
                        </a>
                    </div>
                </Form>

                <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                    <p className="mb-0">
                        Already have an account?{" "}
                        <Link className="text-dark" to="/login">
                            Log in now!
                        </Link>
                    </p>
                </div>
            </Col>
        </Container>
    );
};

export default Register;
