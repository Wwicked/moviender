import React, { useState } from "react";
import { Card, Button, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faX, faClock, faQuestion } from "@fortawesome/free-solid-svg-icons";
import "./MovieCard.css";

const ImageIndicator = ({ totalImages, currentIndex }) => {
    const indicators = Array.from({ length: totalImages }, (_, index) => (
        <span key={index} className={`indicator ${index === currentIndex ? "active" : ""}`} />
    ));

    return <div className="image-indicators">{indicators}</div>;
};

const MovieCard = ({ movie, buttonsBlocked, onLike, onDislike, onWatchLater, onInfo }) => {
    const [imageIndex, setImageIndex] = useState(0);

    const handleLeftClick = () => {
        setImageIndex(imageIndex - 1 < 0 ? 0 : imageIndex - 1);
    };

    const handleRightClick = () => {
        setImageIndex(imageIndex === movie.images.length - 1 ? imageIndex : imageIndex + 1);
    };

    return (
        <Col xs={12} md={9} lg={8} xl={8}>
            <Card className="movie-card">
                <ImageIndicator totalImages={movie.images.length} currentIndex={imageIndex} />

                <div className="image-wrapper">
                    <div className="image-overlay left" onClick={handleLeftClick}></div>
                    <div className="image-overlay right" onClick={handleRightClick}></div>
                    <Card.Img variant="top" src={movie.images[imageIndex]} />
                </div>

                <Card.Body>
                    <Card.Title className="title">{movie.title}</Card.Title>
                    <Card.Subtitle className="release">
                        {movie.year} &bull; {movie.genres.join(", ")}
                    </Card.Subtitle>

                    <div className="button-group">
                        <Button
                            className="dislike"
                            onClick={() => {
                                if (!buttonsBlocked) onDislike(movie);
                            }}
                            variant="outline-danger"
                        >
                            <FontAwesomeIcon icon={faX} />
                        </Button>

                        <Button
                            className="watch-later"
                            onClick={() => {
                                if (!buttonsBlocked) onWatchLater(movie);
                            }}
                            variant="outline-primary"
                        >
                            <FontAwesomeIcon icon={faClock} />
                        </Button>

                        <Button
                            className="info"
                            onClick={() => {
                                if (!buttonsBlocked) onInfo(movie);
                            }}
                            variant="outline-primary"
                        >
                            <FontAwesomeIcon icon={faQuestion} />
                        </Button>

                        <Button
                            className="like"
                            onClick={() => {
                                if (!buttonsBlocked) onLike(movie);
                            }}
                            variant="outline-success"
                        >
                            <FontAwesomeIcon icon={faHeart} />
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default MovieCard;
