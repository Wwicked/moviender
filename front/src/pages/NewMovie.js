import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import InfoModal from "../components/MovieCard/InfoModal";
import MovieCard from "../components/MovieCard/MovieCard";
import "./NewMovie.css";
import { ListGroup } from "react-bootstrap";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Modal from "react-bootstrap/Modal";

const ErrorFeedback = ({ error }) => {
    return error ? <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback> : <></>;
};

const MoviePreview = ({ movie }) => {
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    return (
        <Container className="preview d-flex justify-content-center">
            <MovieCard
                movie={movie}
                onLike={() => {}}
                onDislike={() => {}}
                onWatchLater={() => {}}
                onInfo={() => {
                    setShowModal(true);
                    setModalData(movie);
                }}
            />

            <InfoModal
                show={showModal}
                movie={modalData}
                onClose={() => {
                    setShowModal(false);
                    setModalData(null);
                }}
            />
        </Container>
    );
};

const ImageSelector = ({ onSelectedFilesChange }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...files]);
        onSelectedFilesChange([...selectedFiles, ...files]);
    };

    const handleFileRemove = (index) => {
        setSelectedFiles((prevSelectedFiles) => prevSelectedFiles.filter((file, i) => i !== index));
        onSelectedFilesChange(selectedFiles.filter((file, i) => i !== index));
    };

    const handleDragStart = (event, index) => {
        event.dataTransfer.setData("text/plain", index);
        event.dataTransfer.dropEffect = "move";
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (event, dropIndex) => {
        event.preventDefault();
        const dragIndex = event.dataTransfer.getData("text/plain");
        if (dragIndex === dropIndex) return;
        const newSelectedFiles = [...selectedFiles];
        const [draggedFile] = newSelectedFiles.splice(dragIndex, 1);
        newSelectedFiles.splice(dropIndex, 0, draggedFile);
        setSelectedFiles(newSelectedFiles);
        onSelectedFilesChange(newSelectedFiles);
    };

    return (
        <Form.Group>
            <Form.Label>Choose Images</Form.Label>
            <Form.Control type="file" multiple accept="image/*" onChange={handleFileSelect} />
            <Row className="mt-3">
                {selectedFiles.map((file, index) => (
                    <Col key={index} xs={5} sm={3} md={2} lg={2}>
                        <div
                            className="position-relative"
                            onDragOver={handleDragOver}
                            onDrop={(event) => handleDrop(event, index)}
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt="failed to load"
                                className="image-preview rounded"
                                draggable
                                onDragStart={(event) => handleDragStart(event, index)}
                            />
                            <Button
                                variant="danger"
                                className="position-absolute top-0 end-0"
                                size="sm"
                                onClick={() => handleFileRemove(index)}
                            >
                                &times;
                            </Button>
                        </div>
                    </Col>
                ))}
            </Row>
        </Form.Group>
    );
};

const CastList = ({ onCastChange }) => {
    const [actorName, setActorName] = useState("");
    const [characterName, setCharacterName] = useState("");
    const [castList, setCastList] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleAdd = () => {
        if (actorName === "" || characterName === "") return;

        setCastList([...castList, { real: actorName, movie: characterName }]);
        onCastChange([...castList, { real: actorName, movie: characterName }]);
        setActorName("");
        setCharacterName("");
        setShowModal(false);
    };

    const handleRemove = (index) => {
        setCastList(castList.filter((_, i) => i !== index));
        onCastChange(castList.filter((_, i) => i !== index));
    };

    const handleDragStart = (event, index) => {
        event.dataTransfer.setData("text/plain", index);
        event.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (event, index) => {
        event.preventDefault();
        const dragIndex = Number(event.dataTransfer.getData("text/plain"));
        const item = castList[dragIndex];
        const newCastList = castList.filter((_, i) => i !== dragIndex);
        newCastList.splice(index, 0, item);
        setCastList(newCastList);
        onCastChange(newCastList);
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <Form.Group>
            <Form.Label>
                Characters{" "}
                <Button size="sm" className="mx-2" onClick={handleOpenModal}>
                    +
                </Button>
            </Form.Label>
            <ListGroup>
                {castList.map((cast, index) => (
                    <ListGroupItem
                        key={index}
                        className="d-flex justify-content-between"
                        draggable
                        onDragStart={(event) => handleDragStart(event, index)}
                        onDragOver={handleDragOver}
                        onDrop={(event) => handleDrop(event, index)}
                    >
                        <span>
                            {cast.movie} ({cast.real})
                        </span>
                        <Button variant="danger" onClick={() => handleRemove(index)} className="ms-auto mx-2" size="sm">
                            &times;
                        </Button>
                        <Button variant="secondary" size="sm">
                            &#x2195;
                        </Button>
                    </ListGroupItem>
                ))}
            </ListGroup>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>New character</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>
                        <Row className="my-3">
                            <Col xs={5} sm={5} md={5} lg={5}>
                                <Form.Control
                                    type="text"
                                    placeholder="Character's name"
                                    value={characterName}
                                    onChange={(event) => {
                                        setCharacterName(event.target.value);
                                    }}
                                />
                            </Col>

                            <Col xs={5} sm={5} md={5} lg={5}>
                                <Form.Control
                                    type="text"
                                    placeholder="Actor's name"
                                    value={actorName}
                                    onChange={(event) => {
                                        setActorName(event.target.value);
                                    }}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={handleAdd}>
                        Add
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form.Group>
    );
};

const FunFacts = ({ onFactsChange }) => {
    const [header, setHeader] = useState("");
    const [content, setContent] = useState("");
    const [factsList, setFactsList] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleAdd = () => {
        if (header === "" || content === "") return;

        setFactsList([...factsList, { header: header, content: content }]);
        onFactsChange([...factsList, { header: header, content: content }]);
        setHeader("");
        setContent("");
        setShowModal(false);
    };

    const handleRemove = (index) => {
        setFactsList(factsList.filter((_, i) => i !== index));
        onFactsChange(factsList.filter((_, i) => i !== index));
    };

    const handleDragStart = (event, index) => {
        event.dataTransfer.setData("text/plain", index);
        event.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (event, index) => {
        event.preventDefault();
        const dragIndex = Number(event.dataTransfer.getData("text/plain"));
        const item = factsList[dragIndex];
        const newFactsList = factsList.filter((_, i) => i !== dragIndex);
        newFactsList.splice(index, 0, item);
        setFactsList(newFactsList);
        onFactsChange(newFactsList);
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <Form.Group>
            <Form.Label>
                Fun facts
                <Button size="sm" className="mx-2" onClick={handleOpenModal}>
                    +
                </Button>
            </Form.Label>
            <ListGroup>
                {factsList.map((fact, index) => (
                    <ListGroupItem
                        key={index}
                        className="d-flex justify-content-between"
                        draggable
                        onDragStart={(event) => handleDragStart(event, index)}
                        onDragOver={handleDragOver}
                        onDrop={(event) => handleDrop(event, index)}
                    >
                        <span>
                            <strong>{fact.header}</strong> {fact.content}
                        </span>
                        <Button variant="danger" onClick={() => handleRemove(index)} className="ms-auto mx-2" size="sm">
                            &times;
                        </Button>
                        <Button variant="secondary" size="sm">
                            &#x2195;
                        </Button>
                    </ListGroupItem>
                ))}
            </ListGroup>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>New Fun Fact</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>
                        <Row className="my-3 gap-3">
                            <Row>
                                <Form.Control
                                    type="text"
                                    placeholder="Header"
                                    value={header}
                                    onChange={(event) => {
                                        setHeader(event.target.value);
                                    }}
                                />
                            </Row>

                            <Row>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Content"
                                    value={content}
                                    onChange={(event) => {
                                        setContent(event.target.value);
                                    }}
                                />
                            </Row>
                        </Row>
                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={handleAdd}>
                        Add
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form.Group>
    );
};

const NewGenreModal = ({ show, onClose, onNewGenre }) => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdd = () => {
        setLoading(true);

        // TODO: Send a request to backend to create a new genre
        const success = true;

        if (success) {
            onNewGenre(name);
            setName("");
            onClose();
        }

        setLoading(false);
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>New genre</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <Row className="my-3 gap-3">
                        <Row>
                            <Form.Control
                                type="text"
                                placeholder="Genre name"
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value);
                                }}
                            />
                        </Row>
                    </Row>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={handleAdd} disabled={loading}>
                    Add
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const NewMovie = () => {
    const schema = yup
        .object()
        .shape({
            title: yup.string().required("Title is required."),
            description: yup.string().required("Description is required."),
            release: yup.number().min(1900, "Release year is invalid").required("Release year is required."),
            duration: yup.number().min(1, "Duration is invalid").required("Duration is required."),
            video_id: yup.string(),
            genres: yup
                .array()
                .of(yup.string())
                .test("genres", "Please choose at least one genre", () => movie.genres.length > 0),
            cast: yup
                .array()
                .of(yup.string())
                .test("cast", "Please provide at least one cast member", () => movie.cast.length > 0),
            fun_facts: yup.array().of(yup.string()),
        })
        .required();

    useEffect(() => {
        setLoading(true);
        setAllGenres(["Horror", "Action", "Crime", "Drama"]);
        setLoading(false);
    }, []);

    const [movie, setMovie] = useState({
        id: 1,
        title: "",
        description: "",
        release: 0,
        duration: 0,
        video_id: "",
        images: [],
        genres: [],
        cast: [],
        fun_facts: [],
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: movie,
        resolver: yupResolver(schema),
    });

    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [allGenres, setAllGenres] = useState([]);
    const [showNewGenreModal, setShowNewGenreModal] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMovie((prevMovie) => ({ ...prevMovie, [name]: value }));
    };

    const handleGenreChange = (value) => {
        setMovie((prevMovie) => ({
            ...prevMovie,
            genres: prevMovie.genres.includes(value)
                ? prevMovie.genres.filter((genre) => genre !== value)
                : [...prevMovie.genres, value],
        }));
    };

    const submitForm = async (data) => {
        setAdding(true);
        console.log(`Submitted data: ${data}`);
        setAdding(false);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <Container className="my-5">
            <Row>
                <Col md={12} lg={12} xl={6} className="order-0">
                    <MoviePreview movie={movie} />
                </Col>

                <Col md={12} lg={12} xl={6} className="order-1">
                    <Container className="movie-data">
                        <Form onSubmit={handleSubmit(submitForm)}>
                            <Row className="gap-4">
                                <Form.Group controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        {...register("title")}
                                        type="text"
                                        name="title"
                                        onChange={handleChange}
                                        className={errors?.title?.message && "is-invalid"}
                                    />
                                    <ErrorFeedback error={errors?.title?.message} />
                                </Form.Group>

                                <Col>
                                    <Form.Group controlId="release">
                                        <Form.Label>Release Year</Form.Label>
                                        <Form.Control
                                            {...register("release")}
                                            type="number"
                                            name="release"
                                            onChange={handleChange}
                                            className={errors?.release?.message && "is-invalid"}
                                        />
                                        <ErrorFeedback error={errors?.release?.message} />
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId="duration">
                                        <Form.Label>Duration (minutes)</Form.Label>
                                        <Form.Control
                                            {...register("duration")}
                                            type="number"
                                            name="duration"
                                            onChange={handleChange}
                                            className={errors?.duration?.message && "is-invalid"}
                                        />
                                        <ErrorFeedback error={errors?.duration?.message} />
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId="video_id">
                                        <Form.Label>Video ID</Form.Label>
                                        <Form.Control
                                            {...register("video_id")}
                                            type="text"
                                            name="video_id"
                                            onChange={handleChange}
                                            className={errors?.video_id?.message && "is-invalid"}
                                        />
                                        <ErrorFeedback error={errors?.video_id?.message} />
                                    </Form.Group>
                                </Col>

                                <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        {...register("description")}
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        onChange={handleChange}
                                        className={errors?.description?.message && "is-invalid"}
                                    />
                                    <ErrorFeedback error={errors?.description?.message} />
                                </Form.Group>

                                <Form.Group controlId="genres">
                                    <Form.Label>
                                        Genres
                                        <Button
                                            size="sm"
                                            className="mx-2"
                                            onClick={() => {
                                                setShowNewGenreModal(true);
                                            }}
                                        >
                                            +
                                        </Button>
                                    </Form.Label>
                                    <br />
                                    {allGenres.map((genre) => (
                                        <Badge
                                            {...register("genres")}
                                            key={genre}
                                            pill
                                            bg={movie.genres.includes(genre) ? "primary" : "secondary"}
                                            onClick={() => {
                                                handleGenreChange(genre);
                                            }}
                                            className="me-2 mb-2"
                                        >
                                            {genre}
                                        </Badge>
                                    ))}
                                    <br />
                                    {errors?.genres?.message && (
                                        <Form.Text className="text-danger">{errors?.genres?.message}</Form.Text>
                                    )}
                                    <NewGenreModal
                                        show={showNewGenreModal}
                                        onClose={() => {
                                            setShowNewGenreModal(false);
                                        }}
                                        onNewGenre={(newGenre) => {
                                            setAllGenres((prev) => [...prev, newGenre]);
                                        }}
                                    />
                                </Form.Group>

                                <ImageSelector
                                    onSelectedFilesChange={(files) => {
                                        const urlObjects = [];

                                        files.forEach((file) => {
                                            urlObjects.push(URL.createObjectURL(file));
                                        });

                                        setMovie((prev) => ({
                                            ...prev,
                                            images: urlObjects,
                                        }));
                                    }}
                                />

                                <CastList
                                    onCastChange={(newCast) => {
                                        setMovie((prev) => ({
                                            ...prev,
                                            cast: newCast,
                                        }));
                                    }}
                                />

                                <FunFacts onFactsChange={() => {}} />

                                <Button variant="primary" type="submit" className="mt-5" disabled={adding}>
                                    {adding ? "Adding..." : "Add Movie"}
                                </Button>
                            </Row>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default NewMovie;
