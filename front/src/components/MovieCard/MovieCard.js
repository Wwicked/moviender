import React, { useState } from "react";
import { Card, Button, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faX, faClock, faQuestion } from "@fortawesome/free-solid-svg-icons";
import "./MovieCard.css";
import { useSwipeable } from "react-swipeable";

const ImageIndicator = ({ totalImages, currentIndex }) => {
    const indicators = Array.from({ length: totalImages }, (_, index) => (
        <span key={index} className={`indicator ${index === currentIndex ? "active" : ""}`} />
    ));

    return <div className="image-indicators">{indicators}</div>;
};

const MovieCard = ({
    movie,
    buttonsBlocked,
    swipeBlocked,
    onSwipeLeft,
    onSwipeRight,
    onLike,
    onDislike,
    onWatchLater,
    onInfo,
}) => {
    const [imageIndex, setImageIndex] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState(null);
    const [offsetX, setOffsetX] = useState(0);
    const [dragging, setDragging] = useState(false);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (swipeBlocked) return;

            setSwipeDirection("left");
            onSwipeLeft(movie);

            setOffsetX(0);
            setSwipeDirection(null);
        },
        onSwipedRight: () => {
            if (swipeBlocked) return;

            setSwipeDirection("right");
            onSwipeRight(movie);

            setOffsetX(0);
            setSwipeDirection(null);
        },
        onSwiping: ({ deltaX }) => {
            if (swipeBlocked) return;

            setOffsetX(deltaX);
        },
        onSwiped: () => {
            if (swipeDirection === "left" || swipeDirection === "right") {
                setDragging(false);
            }
            setSwipeDirection(null);
            setOffsetX(0);
        },
        preventDefaultTouchmoveEvent: false,
        trackMouse: true,
        delta: 80,
    });

    const handleMouseDown = () => setDragging(true);
    const handleMouseUp = () => setDragging(false);
    const handleTouchStart = () => setDragging(true);
    const handleTouchEnd = () => setDragging(false);

    const handleSwiped = () => {
        if (swipeDirection === "left" || swipeDirection === "right") {
            return;
        }
        setSwipeDirection(null);
    };

    const handleLeftClick = () => {
        setImageIndex(imageIndex - 1 < 0 ? 0 : imageIndex - 1);
    };

    const handleRightClick = () => {
        setImageIndex(imageIndex === movie.images.length - 1 ? imageIndex : imageIndex + 1);
    };

    const cardStyle = {
        transform: `translate(${
            swipeDirection === "left" ? "-100%" : swipeDirection === "right" ? "100%" : `${offsetX}px`
        })`,
        transition: dragging ? "none" : "transform 0.3s ease-in-out",
        cursor: dragging ? "grabbing" : "grab",
    };

    return (
        <Col xs={12} md={9} lg={8} xl={8}>
            <Card
                {...handlers}
                className="movie-card"
                style={cardStyle}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTransitionEnd={handleSwiped}
            >
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
                            className="dislike shadow"
                            onClick={() => {
                                if (!buttonsBlocked) onDislike(movie);
                            }}
                            variant="outline-danger"
                        >
                            <FontAwesomeIcon icon={faX} />
                        </Button>

                        <Button
                            className="watch-later shadow"
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
                            variant="outline-primary shadow"
                        >
                            <FontAwesomeIcon icon={faQuestion} />
                        </Button>

                        <Button
                            className="like shadow"
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
