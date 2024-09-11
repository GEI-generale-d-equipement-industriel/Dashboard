import { configureStore } from "@reduxjs/toolkit";
import candidateReducer from "./candidatesSlice"
import authReducer from './authSlice'
import favoriteReducer from "./favoritesSlice";
const store =configureStore({
    reducer:{
        candidates: candidateReducer,
        auth:authReducer,
        favorites:favoriteReducer
    }
})




export default store 