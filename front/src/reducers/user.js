import { SET_USER } from "./types";

const initialState = {
    user: null,
};

const userSlice = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };

        default:
            return state;
    }
};

export default userSlice;
