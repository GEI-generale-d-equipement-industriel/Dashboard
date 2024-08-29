import { configureStore } from "@reduxjs/toolkit";
import candidateReducer from "./movieSlice"


const store =configureStore({
    reducer:{
        candidates: candidateReducer
    }
})




export default store 