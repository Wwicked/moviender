import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

const Footer = () => {
    const { user } = useSelector((state) => state.user);

    const [showDiscordModal, setShowDiscordModal] = useState(false);

    const handleClickGithub = () => window.open("https://github.com/wwicked");
    const handleOpenDiscord = () => setShowDiscordModal(true);
    const handleCloseDiscord = () => setShowDiscordModal(false);

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

            <FontAwesomeIcon
                icon={faDiscord}
                size="lg"
                color="white"
                focusable={true}
                onClick={handleOpenDiscord}
                style={{
                    cursor: "pointer",
                }}
            />

            <Modal show={showDiscordModal} onHide={handleCloseDiscord} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Robiin#3683</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                    <Button onClick={handleCloseDiscord} variant="secondary">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Footer;
