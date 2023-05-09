import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useSelector } from "react-redux";

const Footer = () => {
    const { user } = useSelector((state) => state.user);

    const handleClickGithub = () => window.open("https://github.com/wwicked");

    if (!user) {
        return;
    }

    return (
        <div className="d-flex justify-content-center gap-4 p-3 mt-3" style={{ backgroundColor: "rgba(33, 37, 41)" }}>
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
