import axios from "axios";
import API_URL from "./api";
import authHeader from "./headers";

const WITH_TOKEN = { headers: authHeader() };

const read = () => {
    return axios.get(`${API_URL}/users/`, WITH_TOKEN);
};

const UserService = {
    read,
};

export default UserService;
