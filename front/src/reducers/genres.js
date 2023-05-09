import { SET_ALL_GENRES } from "./types";

const initialState = {
    allGenres: null,
};

const genreSlice = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_GENRES:
            return {
                ...state,
                allGenres: action.payload,
            };

        default:
            return state;
    }
};

export default genreSlice;
