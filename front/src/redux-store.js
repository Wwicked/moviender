import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import user from "./reducers/user";

const root = combineReducers({
    user,
});

export default configureStore({
    reducer: root,
});
