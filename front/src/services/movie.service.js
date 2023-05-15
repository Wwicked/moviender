import { api } from "./api";

const newMovie = (movie) => {
    const data = new FormData();

    // Append the files to the form data
    for (let i = 0; i < movie.images.length; i++) {
        data.append("images[]", movie.images[i]);
    }

    // Append the movie object as a JSON string to the form data
    data.append("movie", JSON.stringify(movie));

    return api.post(`/movies/new`, data);
};

const loadNext = (amount) => {
    const data = new FormData();

    data.append("amount", amount);

    return api.get(`/movies/pick`, { data: data });
};

const getMovie = (id) => {
    return api.get(`/movies/${id}`);
};

const getGenre = (id) => {
    return api.get(`/movies/${id}/genre`);
};

const MovieService = {
    newMovie,
    loadNext,

    getMovie,
    getGenre,
};

export default MovieService;
