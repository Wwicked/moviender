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

    const [swipeBlocked, setSwipeBlocked] = useState(false);
    const [buttonsBlocked, setButtonsBlocked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        setMovieOver(dummyMovieOne);
        setMovieUnder(dummyMovieTwo);

        setLoading(false);
    }, []);

    const handleSwipeLeft = (movie) => {
        console.log(`Swipe left!`);

        handleDislike(movie);
    };

    const handleSwipeRight = (movie) => {
        console.log(`Swipe right!`);

        handleLike(movie);
    };

    const handleLike = (movie) => {
        setButtonsBlocked(true);
        setSwipeBlocked(true);

        UserService.like(user.id, movie.id).then((res) => {
            setButtonsBlocked(false);
            setSwipeBlocked(false);
        });
    };

    const handleDislike = (movie) => {
        setButtonsBlocked(true);
        setSwipeBlocked(true);

        UserService.dislike(user.id, movie.id).then((res) => {
            setButtonsBlocked(false);
            setSwipeBlocked(false);
        });
    };

    const handleWatchLater = (movie) => {
        setButtonsBlocked(true);

        UserService.watchLater(user.id, movie.id).then((res) => {
            setButtonsBlocked(false);
        });
    };

    const handleInfo = (movie) => {
        setButtonsBlocked(true);
        setShowModal(true);
        setModalData(movie);
    };

    const handleModalClose = () => {
        setButtonsBlocked(false);
        setShowModal(false);
        setModalData(null);
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
                            buttonsBlocked={true}
                            swipeBlocked={true}
                            onSwipeLeft={() => {}}
                            onSwipeRight={() => {}}
                            onLike={() => {}}
                            onDislike={() => {}}
                            onWatchLater={() => {}}
                            onInfo={() => {}}
                        />
                    </div>
                )}

                <div className="over">
                    <MovieCard
                        movie={movieOver}
                        buttonsBlocked={buttonsBlocked}
                        swipeBlocked={swipeBlocked}
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
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
