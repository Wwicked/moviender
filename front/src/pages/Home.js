import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
    const { user } = useSelector((state) => state.user);

    return <div>User is: {JSON.stringify(user)}</div>;
};

export default Home;
