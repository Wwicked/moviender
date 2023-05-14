import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./WatchLaterModal.css";
import { useEffect, useState } from "react";
import CenteredSpinner from "../CenteredSpinner";
import { useSelector } from "react-redux";
import UserService from "../../services/user.service";
import MovieService from "../../services/movie.service";
import { Row, Col, ListGroup, ListGroupItem } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faX, faClock, faQuestion } from "@fortawesome/free-solid-svg-icons";
import InfoModal from "../InfoModal/InfoModal";

const WatchLaterModal = ({ show, onClose }) => {
    const { user } = useSelector((state) => state.user);

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        setLoading(true);

        UserService.getWatchLater(user?.id)
            .then((res) => {
                const ids = res.data;

                if (ids?.length === 0) {
                    setLoading(false);
                    return;
                }

                const promises = ids?.map((id) => {
                    return MovieService.getMovie(id).then((res) => {
                        return res.data;
                    });
                });

                Promise.all(promises)
                    .then((m) => {
                        setMovies(m);
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                    });
            })
            .catch((err) => {
                setLoading(false);
            });
    }, [user?.id]);

    const handleLike = (movie) => {
        UserService.removeWatchLater(user.id, movie.id).then((res) => {
            setMovies((prev) => prev.filter((m) => m.id !== movie.id));

            UserService.like(user.id, movie.id)
                .then((res) => {})
                .catch((err) => {});
        });
    };

    const handleInfo = (movie) => {
        setShowModal(true);
        setModalData(movie);
    };

    const handleInfoClose = () => {
        setShowModal(false);
        setModalData(null);
    };

    const handleDislike = (movie) => {
        UserService.removeWatchLater(user.id, movie.id).then(() => {
            setMovies((prev) => prev.filter((m) => m.id !== movie.id));

            UserService.dislike(user.id, movie.id)
                .then((res) => {})
                .catch((err) => {});
        });
    };

    if (loading) {
        return (
            <Modal show={true} onHide={() => {}} size="lg">
                <Modal.Body>
                    <CenteredSpinner />
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <>
            <Modal show={show && !showModal} onHide={onClose} size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Movies saved as Watch later</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {movies?.length === 0 && (
                        <Row>
                            <Col className="text-center">
                                <p>You did not save any movies to your Watch Later list</p>
                                <p>
                                    When swiping, click <FontAwesomeIcon icon={faClock} /> to see some movies here!
                                </p>
                            </Col>
                        </Row>
                    )}

                    {movies?.length > 0 && (
                        <ListGroup className="list-group-flush">
                            {movies.map((movie) => (
                                <ListGroupItem key={movie?.id} className="d-flex p-2 gap-2">
                                    <img className="movie-image" src={movie?.images[0]} alt={movie?.title} />

                                    <div className="movie-info">
                                        <h4>
                                            {movie?.title} ({movie?.release})
                                        </h4>
                                        <p>{movie?.genres.join(", ")}</p>
                                    </div>

                                    <div className="movie-buttons d-flex flex-column justify-content-center gap-3">
                                        <Button
                                            className="like"
                                            onClick={() => {
                                                handleLike(movie);
                                            }}
                                            variant="outline-success"
                                        >
                                            <FontAwesomeIcon icon={faHeart} />
                                        </Button>

                                        <Button
                                            className="info"
                                            onClick={() => {
                                                handleInfo(movie);
                                            }}
                                            variant="outline-secondary"
                                        >
                                            <FontAwesomeIcon icon={faQuestion} />
                                        </Button>

                                        <Button
                                            className="dislike"
                                            onClick={() => {
                                                handleDislike(movie);
                                            }}
                                            variant="outline-danger"
                                        >
                                            <FontAwesomeIcon icon={faX} />
                                        </Button>
                                    </div>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <InfoModal show={showModal} movie={modalData} onClose={handleInfoClose} />
        </>
    );
};

export default WatchLaterModal;
