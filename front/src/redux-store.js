import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import user from "./reducers/user";
import genres from "./reducers/genres";

const root = combineReducers({
    user,
    genres,
});

export default configureStore({
    reducer: root,
});
