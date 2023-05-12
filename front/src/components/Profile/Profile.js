import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import CenteredSpinner from "../CenteredSpinner";
import MovieService from "../../services/movie.service";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = ({ show, onClose }) => {
    const { user } = useSelector((state) => state.user);

    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        liked_in_genre: [],
    });

    const [data, setData] = useState(null);

    useEffect(() => {
        setLoading(true);

        const promises = user?.liked_movies?.map((id) => {
            return MovieService.getGenre(id).then((res) => {
                return res.data;
            });
        });

        Promise.all(promises)
            .then((genres) => {
                const newStats = {};

                genres.forEach((names) => {
                    names.forEach((name) => {
                        newStats[name] = (newStats[name] || 0) + 1;
                    });
                });

                setStats({ liked_in_genre: newStats });
                setData({
                    labels: Object.keys(newStats),
                    datasets: [
                        {
                            label: "no. movies",
                            backgroundColor: "rgba(120, 100, 100, 0.6)",
                            borderColor: "rgba(0, 0, 0, 0.1)",
                            data: Object.values(newStats),
                        },
                    ],
                });

                setLoading(false);
            })
            .catch((err) => {
                console.error(`Error fetching movies' genres: ${err}`);
                setLoading(false);
            });
    }, [user?.liked_movies]);

    if (loading) {
        return <CenteredSpinner />;
    }

    return (
        <Modal show={show} onHide={onClose} size="md">
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    <Container className="entry-title">Liked movies by genre</Container>
                    <Container className="entry-value">
                        {data && <Pie data={data} options={{ responsive: true }} />}
                    </Container>
                </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Profile;
