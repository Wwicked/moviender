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

    return (
        <Form.Group>
            <Form.Label>Choose Images</Form.Label>
            <Form.Control type="file" multiple accept="image/*" onChange={handleFileSelect} />
            <Row className="mt-3">
                {selectedFiles.map((file, index) => (
                    <Col key={index} xs={6} sm={4} md={3} lg={3}>
                        <div className="position-relative">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="failed to load"
                                className="image-preview rounded"
                            />
                            <button
                                type="button"
                                className="btn btn-danger position-absolute top-0 end-0"
                                onClick={() => handleFileRemove(index)}
                            >
                                &times;
                            </button>
                        </div>
                    </Col>
                ))}
            </Row>
        </Form.Group>
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
        images: [
            "https://www.themoviedb.org/t/p/w1280/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg",
            "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        ],
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
                                    <Form.Label>Genres</Form.Label>
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
