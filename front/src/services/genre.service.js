import { api } from "./api";

const newGenre = (name) => {
    const data = new FormData();

    data.append("name", name);

    return api.post(`/genres/new`, data);
};

const getAll = () => {
    return api.get(`/genres/`);
};

const GenreService = {
    newGenre,
    getAll,
};

export default GenreService;
