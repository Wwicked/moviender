import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import MovieService from "../services/movie.service";

const TestPage = () => {
    const movie = {
        title: "Halloween",
        description: "1978 classic horror slasher movie",
        release: 1978,
        duration: 172,
        genres: ["Horror", "Slasher"],
        images: ["some", "images"],
        fun_facts: [
            {
                header: "Header info",
                content: "Content into",
            },
        ],
        cast: [
            {
                real: "Will Smith",
                movie: "Mike Lowrey",
            },
        ],
    };
    const [loading, setLoading] = useState(false);

    const handleButtonClick = () => {
        setLoading(true);

        MovieService.newMovie(movie)
            .then((res) => {
                console.log(`Response: ${JSON.stringify(res?.data?.message)}`);
            })
            .catch((err) => {
                console.log(`Error: ${JSON.stringify(err?.response?.data?.message)}`);
            });

        setLoading(false);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <Container>
            <Button onClick={handleButtonClick}>Click me</Button>
        </Container>
    );
};

export default TestPage;
