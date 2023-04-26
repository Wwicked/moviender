import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import MovieCard from "../components/MovieCard/MovieCard";
import InfoModal from "../components/MovieCard/InfoModal";
import UserService from "../services/user.service";

const movie = {
    id: 1,
    title: "The Godfather",
    year: 1972,
    images: [
        "https://www.themoviedb.org/t/p/w1280/rPdtLWNsZmAtoZl9PK7S2wE3qiS.jpg",
        "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    ],
    genres: ["Action", "Thriller"],
};

const Home = () => {
    const { user } = useSelector((state) => state.user);

    const [swipeBlocked, setSwipeBlocked] = useState(false);
    const [buttonsBlocked, setButtonsBlocked] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

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

    return (
        <Container>
            <Container>
                <p>User: {JSON.stringify(user, null, 4)}</p>
            </Container>

            <Container className="d-flex justify-content-center">
                <MovieCard
                    movie={movie}
                    buttonsBlocked={buttonsBlocked}
                    swipeBlocked={swipeBlocked}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onWatchLater={handleWatchLater}
                    onInfo={handleInfo}
                />
                <InfoModal show={showModal} movie={modalData} onClose={handleModalClose} />
            </Container>
        </Container>
    );
};

export default Home;
