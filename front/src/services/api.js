import axios from "axios";
import Cookies from "js-cookie";
import axiosRetry from "axios-retry";

const API_URL = "http://localhost:5000";
const DEFAULT_RETRIES = 3;

const token = Cookies.get("access_token");
const api = axios.create({
    baseURL: API_URL,
});

axiosRetry(api, { retries: DEFAULT_RETRIES });

if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const updateAuthCookiesAndHeader = (access_token, refresh_token) => {
    Cookies.set("access_token", access_token, { path: "/" });
    Cookies.set("refresh_token", refresh_token, { path: "/" });

    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
};

const removeAuthCookiesAndHeader = () => {
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });

    api.defaults.headers.common["Authorization"] = "";
};

export { api, updateAuthCookiesAndHeader, removeAuthCookiesAndHeader };
