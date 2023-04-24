import { api } from "./api";

const login = (username, password) => {
    const data = new FormData();

    data.append("username", username);
    data.append("password", password);

    return api.post("/auth/login", data);
};

const register = (username, password) => {
    const data = new FormData();

    data.append("username", username);
    data.append("password", password);

    return api.post("/auth/register", data);
};

const authservice = {
    login,
    register,
};

export default authservice;
