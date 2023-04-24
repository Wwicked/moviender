import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:5000";
const token = Cookies.get("access_token");
const api = axios.create({
    baseURL: API_URL,
});

if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const updateAuthCookiesAndHeader = (access_token, refresh_token) => {
    Cookies.set("access_token", access_token);
    Cookies.set("refresh_token", refresh_token);

    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
};

export { api, updateAuthCookiesAndHeader };
