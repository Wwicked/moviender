import { useEffect, useState } from "react";
import { Badge, Col, Container, Row, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER } from "../../reducers/types";
import GenreService from "../../services/genre.service";
import UserService from "../../services/user.service";
import "./SettingsModal.css";
import Slider from "@mui/material/Slider";

const SettingsModal = ({ show, onClose }) => {
    const DEFAULT_YEAR_RANGE = [1900, 2025];

    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [allGenres, setAllGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState(user?.settings);

    useEffect(() => {
        setLoading(true);

        GenreService.getAll()
            .then((res) => {
                setAllGenres(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

    const handleSelectGenre = (genre) => {
        if (settings?.excluded_genres?.includes(genre)) {
            setSettings((prev) => ({
                ...prev,
                excluded_genres: settings?.excluded_genres?.filter((g) => g !== genre),
            }));
        } else {
            setSettings((prev) => ({
                ...prev,
                excluded_genres: [...prev?.excluded_genres, genre],
            }));
        }
    };

    const handleYearRangeChange = (event, newValue) => {
        setSettings((prev) => ({
            ...prev,
            yearFrom: newValue[0],
            yearTo: newValue[1],
        }));
    };

    const handleClose = () => {
        setLoading(true);

        UserService.updateSettings(user.id, settings)
            .then((res) => {
                dispatch({
                    type: SET_USER,
                    payload: res.data,
                });

                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });

        onClose();
    };

    if (loading) {
        return (
            <Modal show={true} onHide={() => {}} size="md">
                <Modal.Body>
                    <Spinner />
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={handleClose} size="md">
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Col className="d-flex flex-column gap-3">
                    <Row>
                        <Container className="settings-title">
                            <strong>Genres at swipe:</strong>
                        </Container>
                        <Container className="settings-value mx-3">
                            <div className="genres-list">
                                {allGenres?.map((genre) => (
                                    <Badge
                                        bg={`${settings.excluded_genres.includes(genre) ? "secondary" : "primary"}`}
                                        className="m-1"
                                        onClick={() => {
                                            handleSelectGenre(genre);
                                        }}
                                        style={{
                                            cursor: "grab",
                                        }}
                                        key={genre}
                                    >
                                        {genre}
                                    </Badge>
                                ))}
                            </div>
                        </Container>
                    </Row>

                    <Row>
                        <Container className="settings-title">
                            <strong>Year range at swipe:</strong>
                        </Container>
                        <Container className="settings-value mx-3">
                            <Slider
                                size="medium"
                                min={DEFAULT_YEAR_RANGE[0]}
                                max={DEFAULT_YEAR_RANGE[1]}
                                value={[settings.yearFrom, settings.yearTo]}
                                onChange={handleYearRangeChange}
                                style={{
                                    maxWidth: "95%",
                                }}
                                valueLabelDisplay="auto"
                            />
                        </Container>
                    </Row>
                </Col>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SettingsModal;
