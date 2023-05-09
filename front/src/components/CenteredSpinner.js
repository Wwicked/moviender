import React from "react";
import { Container, Spinner } from "react-bootstrap";

const CenteredSpinner = () => {
    return (
        <Container className="my-5 align-items-center justify-content-center">
            <Spinner />
        </Container>
    );
};

export default CenteredSpinner;
