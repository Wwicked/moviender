import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:5000";
const api = axios.create({
    baseURL: API_URL,
});
const token = Cookies.get("access_token");

if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log(`Setting header token to: ${token}`);
}

export default api;
