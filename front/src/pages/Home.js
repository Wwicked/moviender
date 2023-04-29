import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import MovieCard from "../components/MovieCard/MovieCard";
import InfoModal from "../components/MovieCard/InfoModal";
import UserService from "../services/user.service";
import "./Home.css";

const dummyMovieOne = {
    id: 1,
    title: "The Godfather",
    description:
        "Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger. Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger. Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.",
    year: 1972,
    duration: 175,
    images: [
        "https://www.themoviedb.org/t/p/w1280/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg",
        "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    ],
    funFacts: [
        {
            header: "The horse's head was real! ",
            content:
                "...as were actor John Marley's screams. A fake horse head was used in rehearsals, but when the cameras were actually rolling, Coppola replaced it with the real thing, much to Marley's surprise.",
        },
    ],
    genres: ["Crime", "Drama", "Crime"],
    cast: [
        {
            real: "Al Pacino",
            movie: "Michael Corleone",
        },
        {
            real: "Marlon Brando",
            movie: "Vito Corleone",
        },
        {
            real: "James Caan",
            movie: "Sonny Corleone",
        },
        {
            real: "Diane Keaton",
            movie: "Kay Adams-Corleone",
        },
        {
            real: "Talia Shire",
            movie: "Connie Corleone",
        },
        {
            real: "John Cazale",
            movie: "Fredo Corleone",
        },
    ],
};

const dummyMovieTwo = {
    id: 1,
    title: "2 The Godfather",
    description:
        "Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.",
    year: 2001,
    duration: 192,
    images: [
        "https://www.themoviedb.org/t/p/w1280/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg",
        "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    ],
    funFacts: [
        {
            header: "The horse's head was real! ",
            content:
                "...as were actor John Marley's screams. A fake horse head was used in rehearsals, but when the cameras were actually rolling, Coppola replaced it with the real thing, much to Marley's surprise.",
        },
    ],
    genres: ["Crime", "Drama"],
    cast: [
        {
            real: "Al Pacino",
            movie: "Michael Corleone",
        },
        {
            real: "Marlon Brando",
            movie: "Vito Corleone",
        },
        {
            real: "James Caan",
            movie: "Sonny Corleone",
        },
        {
            real: "Diane Keaton",
            movie: "Kay Adams-Corleone",
        },
        {
            real: "Talia Shire",
            movie: "Connie Corleone",
        },
        {
            real: "John Cazale",
            movie: "Fredo Corleone",
        },
    ],
};

const Home = () => {
    const { user } = useSelector((state) => state.user);

    const [movieOver, setMovieOver] = useState(null);
    const [movieUnder, setMovieUnder] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [clicked, setClicked] = useState(false);

    const [swipeDirection, setSwipeDirection] = useState(null);

    useEffect(() => {
        setLoading(true);

        setMovieOver(dummyMovieOne);
        setMovieUnder(dummyMovieTwo);

        setLoading(false);
    }, []);

    const handleLike = (movie) => {
        if (clicked) return;

        setClicked(true);

        UserService.like(user.id, movie.id).then((res) => {
            setSwipeDirection("right");
            setClicked(false);
        });
    };

    const handleDislike = (movie) => {
        if (clicked) return;

        setClicked(true);

        UserService.dislike(user.id, movie.id).then((res) => {
            setSwipeDirection("left");
            setClicked(false);
        });
    };

    const handleWatchLater = (movie) => {
        if (clicked) return;

        setClicked(true);

        UserService.watchLater(user.id, movie.id).then((res) => {
            setSwipeDirection("up");
            setClicked(false);
        });
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

        console.log("!");

        setSwipeDirection(null);
        setMovieOver(movieUnder);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <Container>
            <Container>
                <p>User: {JSON.stringify(user, null, 4)}</p>
            </Container>

            <Container className="d-flex justify-content-center">
                {movieUnder && (
                    <div className="under">
                        <MovieCard
                            movie={movieUnder}
                            onLike={() => {}}
                            onDislike={() => {}}
                            onWatchLater={() => {}}
                            onInfo={() => {}}
                        />
                    </div>
                )}

                <div className={`over ${swipeDirection ? swipeDirection : ""}`} onTransitionEnd={handleTransitionEnd}>
                    <MovieCard
                        movie={movieOver}
                        onLike={handleLike}
                        onDislike={handleDislike}
                        onWatchLater={handleWatchLater}
                        onInfo={handleInfo}
                    />
                </div>
                <InfoModal show={showModal} movie={modalData} onClose={handleModalClose} />
            </Container>
        </Container>
    );
};

export default Home;
