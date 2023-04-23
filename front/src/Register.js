import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState("");
    const [registerError, setRegisterError] = useState("");

    const onRegisterClick = async () => {
        const data = new FormData();

        data.append("username", username);
        data.append("password", password);

        await axios
            .post("http://localhost:5000/auth/register", data)
            .then((res) => {
                console.log(`res: ${JSON.stringify(res)}`);
                const accessToken = res?.data?.access_token?.substring(0, 15);
                const refreshToken = res?.data?.refresh_token?.substring(0, 15);

                setRegisterSuccess(`Successfully registered! Your credentials: ${accessToken} ${refreshToken}`);
            })
            .catch((error) => {
                setRegisterError("Unknown error occured. Try again.");

                if (error.response) {
                    if (error.response.status === 409) {
                        setRegisterError("User with that username already exists.");
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
            {registerSuccess.length > 0 && <p>{registerSuccess}</p>}
            {registerError.length > 0 && <p>{registerError}</p>}
            <section>
                <div className="container-fluid row col-sm-6 text-black">
                    <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
                        <form style={{ width: "23rem" }}>
                            <div className="form-outline mb-4">
                                <input
                                    type="text"
                                    id="form2Example112"
                                    value={username}
                                    className="form-control form-control-lg"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label className="form-label" htmlFor="form2Example112">
                                    Username
                                </label>
                            </div>

                            <div className="form-outline mb-4">
                                <input
                                    type="password"
                                    id="form2Example2555"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control form-control-lg"
                                />
                                <label className="form-label" htmlFor="form2Example2555">
                                    Password
                                </label>
                            </div>

                            <div className="pt-1 mb-4">
                                <Button variant="info" size="medium" className="btn-block" onClick={onRegisterClick}>
                                    Register
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>{" "}
        </>
    );
};

export default Register;
