import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginSuccess, setLoginSuccess] = useState("");
    const [loginError, setLoginError] = useState("");

    const onLoginClick = async () => {
        const data = new FormData();

        data.append("username", username);
        data.append("password", password);

        await axios
            .post("http://localhost:5000/auth/login", data)
            .then((res) => {
                setLoginSuccess("Successfully logged in!");
            })
            .catch((error) => {
                setLoginError("Unknown error occured. Try again.");

                if (error.response) {
                    if (error.response.status === 409) {
                        setLoginError("Invalid username or password provided.");
                    }
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });
    };

    return (
        <>
            {loginSuccess.length > 0 && <p>{loginSuccess}</p>}
            {loginError.length > 0 && <p>{loginError}</p>}
            <section>
                <div className="container-fluid row col-sm-6 text-black">
                    <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
                        <form style={{ width: "23rem" }}>
                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    id="form2Example18"
                                    value={username}
                                    className="form-control form-control-lg"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label className="form-label" htmlFor="form2Example18">
                                    Username
                                </label>
                            </div>

                            <div className="form-outline mb-4">
                                <input
                                    type="password"
                                    id="form2Example28"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control form-control-lg"
                                />
                                <label className="form-label" htmlFor="form2Example28">
                                    Password
                                </label>
                            </div>

                            <div className="pt-1 mb-4">
                                <Button variant="info" size="medium" className="btn-block" onClick={onLoginClick}>
                                    Login
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;
