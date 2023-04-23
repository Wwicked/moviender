import React, { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Button from "react-bootstrap/Button";

const LoginRegisterPills = () => {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div>
            <ul className="nav nav-justified mb-3 gap-2 mb-5 justify-content-center">
                <Button
                    className={`${showLogin && "active text-light"}`}
                    variant="outline-secondary"
                    style={{ width: "45%" }}
                    onClick={() => {
                        setShowLogin(true);
                    }}
                >
                    Login
                </Button>
                <Button
                    className={`${!showLogin && "active text-light"}`}
                    variant="outline-secondary"
                    style={{ width: "45%" }}
                    onClick={() => {
                        setShowLogin(false);
                    }}
                >
                    Register
                </Button>
            </ul>

            {showLogin ? <Login /> : <Register />}
        </div>
    );
};

export default LoginRegisterPills;
