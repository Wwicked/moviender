import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import MovieCard from "../components/MovieCard/MovieCard";

const movie = {
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

    return (
        <Container>
            <Container>
                <p>User: {JSON.stringify(user, null, 4)}</p>
            </Container>

            <Container className="d-flex justify-content-center">
                <MovieCard movie={movie} />
            </Container>
        </Container>
    );
};

export default Home;
