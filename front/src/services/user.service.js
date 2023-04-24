import api from "./api";

const read = () => {
    return api.get(`/users/`);
};

const UserService = {
    read,
};

export default UserService;
