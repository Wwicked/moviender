import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";
import "./InfoModal.css";

const InfoModal = ({ show, movie, onClose }) => {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{movie?.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <Col>
                        <Row className="movie-info-row">
                            <div className="movie-info-title">Description:</div>
                            <div className="movie-info-value">{movie?.description}</div>
                        </Row>

                        <Row className="movie-info-row">
                            <div className="movie-info-title">Release:</div>
                            <div className="movie-info-value">{movie?.year}</div>
                        </Row>

                        <Row className="movie-info-row">
                            <div className="movie-info-title">Genre:</div>
                            <div className="movie-info-value">{movie?.genres?.join(", ")}</div>
                        </Row>

                        {movie?.funFacts?.length > 0 && (
                            <Row className="movie-info-row">
                                <div className="movie-info-title">Fun facts:</div>
                                <div className="movie-info-value">
                                    <ul>
                                        {movie?.funFacts?.map((fact) => {
                                            return (
                                                <li>
                                                    <strong>{fact?.header}</strong>
                                                    <p>{fact?.content}</p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </Row>
                        )}

                        <Row className="movie-info-row">
                            <div className="movie-info-title">Cast:</div>
                            <div className="movie-info-value">
                                <ul>
                                    {movie?.cast?.map((c) => {
                                        return <li>{`${c.movie} (${c.real})`}</li>;
                                    })}
                                </ul>
                            </div>
                        </Row>
                    </Col>
                </Container>
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
