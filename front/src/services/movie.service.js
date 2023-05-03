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

const MovieService = {
    newMovie,
};

export default MovieService;
