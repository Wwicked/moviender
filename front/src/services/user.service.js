import { api } from "./api";

const read = () => {
    return api.get(`/users/`);
};

const like = (user_id, movie_id) => {
    const data = new FormData();

    data.append("movie_id", movie_id);

    return api.post(`/users/${user_id}/likes`, data);
};

const dislike = (user_id, movie_id) => {
    const data = new FormData();

    data.append("movie_id", movie_id);

    return api.post(`/users/${user_id}/dislikes`, data);
};

const watchLater = (user_id, movie_id) => {
    const data = new FormData();

    data.append("movie_id", movie_id);

    return api.post(`/users/${user_id}/watch-later`, data);
};

const updateSettings = (user_id, settings) => {
    const data = new FormData();

    for (const [key, value] of Object.entries(settings)) {
        data.append(key, JSON.stringify(value));
    }

    return api.post(`/users/${user_id}/settings`, data);
};

const UserService = {
    read,
    like,
    dislike,
    watchLater,
    updateSettings,
};

export default UserService;
