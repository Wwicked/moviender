import axios from "axios";
import API_URL from "./api";

const login = (username, password) => {
    const data = new FormData();

    data.append("username", username);
    data.append("password", password);

    return axios.post(`${API_URL}/auth/login`, data);
};

const register = (username, password) => {
    const data = new FormData();

    data.append("username", username);
    data.append("password", password);

    return axios.post(`${API_URL}/auth/register`, data);
};

const authservice = {
    login,
    register,
};

export default authservice;
