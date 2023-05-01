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

const ErrorFeedback = ({ error }) => {
    return error ? <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback> : <></>;
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

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
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
                <Col>
                    <Container className="preview">
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
                </Col>

                <Col>
                    <Container className="movie-data">
                        <Form onSubmit={handleSubmit(submitForm)} className="my-5">
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
