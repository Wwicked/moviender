import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Container } from "react-bootstrap";
import "./InfoModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faTicket } from "@fortawesome/free-solid-svg-icons";

const InfoModal = ({ show, movie, onClose }) => {
    const formatDuration = (minutes) => {
        const h = Math.floor((minutes % 1440) / 60);
        const m = minutes % 60;
        let out = "";

        if (h) {
            out += `${h}h `;
        }

        out += `${m}m`;

        return out;
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{movie?.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <Col>
                        <Row className="movie-info-row movie-info-headers">
                            <Col className="text-center" xs={3} md={3} lg={3} xl={3}>
                                <div className="movie-info-headers-icon">
                                    {<FontAwesomeIcon icon={faClock} size="xl" />}
                                </div>
                                <div className="movie-info-headers-value">{formatDuration(movie?.duration)}</div>
                            </Col>

                            <Col className="text-center" xs={6} md={6} lg={6} xl={6}>
                                <div className="movie-info-headers-icon">
                                    {<FontAwesomeIcon icon={faTicket} size="xl" />}
                                </div>
                                <div className="movie-info-headers-value">{movie?.genres?.join(", ")}</div>
                            </Col>

                            <Col className="text-center" xs={3} md={3} lg={3} xl={3}>
                                <div className="movie-info-headers-icon">
                                    {<FontAwesomeIcon icon={faCalendar} size="xl" />}
                                </div>
                                <div className="movie-info-headers-value">{movie?.release}</div>
                            </Col>
                        </Row>

                        <hr className="movie-info-divider mx-auto" />

                        {movie?.video_id && (
                            <div className="yt-video my-4">
                                <iframe
                                    width="853"
                                    height="480"
                                    src={`https://www.youtube.com/embed/${movie?.videoId}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Embedded youtube"
                                />
                            </div>
                        )}

                        <Row className="movie-info-row">
                            <div className="movie-info-title">Description:</div>
                            <div className="movie-info-value">{movie?.description}</div>
                        </Row>

                        {movie?.fun_facts?.length > 0 && (
                            <Row className="movie-info-row">
                                <div className="movie-info-title">Fun facts:</div>
                                <div className="movie-info-value">
                                    <ul>
                                        {movie?.fun_facts?.map((fact) => {
                                            return (
                                                <li key={fact?.header}>
                                                    <strong>{fact?.header}</strong>
                                                    <p>{fact?.content}</p>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </Row>
                        )}

                        {movie?.cast?.length > 0 && (
                            <Row className="movie-info-row">
                                <div className="movie-info-title">Characters:</div>
                                <div className="movie-info-value">
                                    <ul>
                                        {movie?.cast?.map((c) => {
                                            return <li key={c.real}>{`${c.movie} (${c.real})`}</li>;
                                        })}
                                    </ul>
                                </div>
                            </Row>
                        )}
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
