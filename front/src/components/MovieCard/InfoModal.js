import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const InfoModal = ({ show, movie, onClose }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{movie?.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>
                    {movie?.title} ({movie?.year})
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InfoModal;
