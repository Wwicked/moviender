import React, { useEffect, useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import EmptyCard from "../components/EmptyCard/EmptyCard";
import InfoModal from "../components/MovieCard/InfoModal";
import MovieCard from "../components/MovieCard/MovieCard";
import MovieService from "../services/movie.service";
import UserService from "../services/user.service";
import "./Home.css";

const Home = () => {
    const { user } = useSelector((state) => state.user);

    const [movies, setMovies] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [failedToLoad, setFailedToLoad] = useState(false);
    const [clicked, setClicked] = useState(false);

    const [swipeDirection, setSwipeDirection] = useState(null);

    useEffect(() => {
        setLoading(true);
        setFailedToLoad(false);

        Promise.all([MovieService.loadNext(), MovieService.loadNext()])
            .then((responses) => {
                const movies = responses.map((response) => response.data);
                setMovies(movies);
                setLoading(false);
                setFailedToLoad(false);
            })
            .catch((error) => {
                setLoading(false);
                setFailedToLoad(true);
                console.error(error);
            });
    }, []);

    const loadNextMovie = () => {
        MovieService.loadNext()
            .then((res) => {
                setMovies((prev) => [...prev, res.data]);
            })
            .catch((err) => {});
    };

    const handleLike = (movie) => {
        if (clicked) return;

        setClicked(true);

        UserService.like(user.id, movie.id)
            .then((res) => {
                setSwipeDirection("right");
                setClicked(false);
            })
            .catch((err) => {
                setClicked(false);
            });

        loadNextMovie();
    };

    const handleDislike = (movie) => {
        if (clicked) return;

        setClicked(true);

        UserService.dislike(user.id, movie.id)
            .then((res) => {
                setSwipeDirection("left");
                setClicked(false);
            })
            .catch((err) => {
                setClicked(false);
            });

        loadNextMovie();
    };

    const handleWatchLater = (movie) => {
        if (clicked) return;

        setClicked(true);

        UserService.watchLater(user.id, movie.id)
            .then((res) => {
                setSwipeDirection("up");
                setClicked(false);
            })
            .catch((err) => {
                setClicked(false);
            });

        loadNextMovie();
    };

    const handleInfo = (movie) => {
        setShowModal(true);
        setModalData(movie);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setModalData(null);
    };

    const handleTransitionEnd = () => {
        if (!["up", "left", "right"].includes(swipeDirection) || clicked) return;

        setSwipeDirection(null);
        setMovies((prev) => prev.slice(1));
    };

    return (
        <Container>
            <Container className="d-flex justify-content-center my-2">
                {loading && (
                    <EmptyCard
                        title={failedToLoad ? "Failed to load..." : <Spinner />}
                        subtitle={
                            failedToLoad ? (
                                <Button
                                    onClick={() => {
                                        loadNextMovie();
                                    }}
                                    size="sm"
                                >
                                    Try again?
                                </Button>
                            ) : (
                                "Loading..."
                            )
                        }
                    />
                )}

                {movies.length === 0 && !loading && (
                    <EmptyCard
                        title="You've ran out of movies!"
                        subtitle={
                            <span>
                                Try <button>fixing</button> the criteria
                            </span>
                        }
                    ></EmptyCard>
                )}

                {movies.length > 1 && (
                    <div className="under">
                        <MovieCard
                            movie={movies[1]}
                            onLike={() => {}}
                            onDislike={() => {}}
                            onWatchLater={() => {}}
                            onInfo={() => {}}
                        />
                    </div>
                )}

                {movies.length > 0 && (
                    <>
                        <div
                            className={`over ${swipeDirection ? swipeDirection : ""}`}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            <MovieCard
                                movie={movies[0]}
                                onLike={handleLike}
                                onDislike={handleDislike}
                                onWatchLater={handleWatchLater}
                                onInfo={handleInfo}
                            />
                        </div>
                        <InfoModal show={showModal} movie={modalData} onClose={handleModalClose} />
                    </>
                )}
            </Container>
        </Container>
    );
};

export default Home;
