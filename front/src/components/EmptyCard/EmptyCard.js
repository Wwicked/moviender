import React from "react";
import { Card, Col } from "react-bootstrap";
import "./EmptyCard.css";

const EmptyCard = ({ title, subtitle }) => {
    return (
        <Col col={12}>
            <Card className="empty-card">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                    <Card.Title className="title text-center">{title}</Card.Title>
                    <Card.Subtitle className="text-center">{subtitle}</Card.Subtitle>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default EmptyCard;
