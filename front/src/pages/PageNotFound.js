import React from "react";
import { Navigate } from "react-router-dom";

const PageNotFound = () => {
    return <Navigate to="/" replace />;
};

export default PageNotFound;
