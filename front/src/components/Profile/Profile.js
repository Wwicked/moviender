import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import CenteredSpinner from "../CenteredSpinner";
import MovieService from "../../services/movie.service";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartBackgroundColors = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(255, 99, 255, 0.2)",
    "rgba(0, 153, 153, 0.2)",
    "rgba(255, 204, 204, 0.2)",
    "rgba(102, 153, 0, 0.2)",
    "rgba(255, 215, 0, 0.2)",
    "rgba(128, 0, 128, 0.2)",
    "rgba(255, 128, 128, 0.2)",
    "rgba(0, 128, 128, 0.2)",
    "rgba(165, 42, 42, 0.2)",
];

const ChartBorderColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(255, 99, 255, 1)",
    "rgba(0, 153, 153, 1)",
    "rgba(255, 204, 204, 1)",
    "rgba(102, 153, 0, 1)",
    "rgba(255, 215, 0, 1)",
    "rgba(128, 0, 128, 1)",
    "rgba(255, 128, 128, 1)",
    "rgba(0, 128, 128, 1)",
    "rgba(165, 42, 42, 1)",
];

const Profile = ({ show, onClose }) => {
    const { user } = useSelector((state) => state.user);

    const [loading, setLoading] = useState(false);
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

                setData({
                    labels: Object.keys(newStats),
                    datasets: [
                        {
                            label: "# of liked movies",
                            backgroundColor: ChartBackgroundColors,
                            borderColor: ChartBorderColors,
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
                <Modal.Title>Profile</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    <Container className="entry-title mb-2">Liked movies by genre</Container>
                    <Container className="entry-value">
                        {data && <Doughnut data={data} options={{ responsive: true }} />}
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
