import Cookies from "js-cookie";

const authHeader = () => {
    const token = Cookies.get("access_token");

    if (token) {
        return { Authorization: "Bearer " + token };
    } else {
        return {};
    }
};

export default authHeader;
