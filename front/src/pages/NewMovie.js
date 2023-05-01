import React from "react";
import { useSelector } from "react-redux";

const NewMovie = () => {
    const { user } = useSelector((state) => state.user);

    return <div>{user?.is_admin}</div>;
};

export default NewMovie;
