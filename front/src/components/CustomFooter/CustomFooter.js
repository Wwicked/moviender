import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useSelector } from "react-redux";
import "./CustomFooter.css";

const Footer = () => {
    const { user } = useSelector((state) => state.user);

    const handleClickGithub = () => window.open("https://github.com/wwicked");

    if (!user) {
        return;
    }

    return (
        <div className="d-flex justify-content-center gap-4 p-3 w-100 mt-5 custom-footer">
            <FontAwesomeIcon
                icon={faGithub}
                size="lg"
                color="white"
                focusable={true}
                onClick={handleClickGithub}
                style={{
                    cursor: "pointer",
                }}
            />
        </div>
    );
};

export default Footer;
