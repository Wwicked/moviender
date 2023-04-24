import React, { useEffect } from "react";
import UserService from "../services/user.service";

const Home = () => {
    useEffect(() => {
        UserService.read().then((res) => {
            console.log(`Response: ${JSON.stringify(res)}`);
        });
    }, []);

    return <div>Home</div>;
};

export default Home;
