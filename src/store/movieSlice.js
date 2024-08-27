import { createSlice } from "@reduxjs/toolkit";
import mockMovies from "../data/mockData";

const movieSlice =createSlice({
    name:"movies",
    initialState:{
        movies:mockMovies,
        favorites:JSON.parse(localStorage.getItem('favoriteMovies')) || [],
        selectedGenre:"",
        searchFilter: null,
        currentPage: 1,  
    pageSize: 3, 
    ratings:{}
},
reducers:{
    
    filterByGenre:(state,action)=>{
        state.selectedGenre=action.payload
    },
    setSearchFilter:(state,action)=>{
        state.searchFilter=action.payload
    },
   
    filterByTitle: (state, action) => {
        const searchTerm = action.payload;
        const normalizedTitle = searchTerm.toLowerCase();
        state.searchFilter = searchTerm === "" ? null : normalizedTitle;
      },

      clearFilters:(state)=>{
        state.selectedGenre=""
        state.searchFilter=null
      },
      clearGenre:(state)=>{
        state.selectedGenre=""
      },
      toggleFavorite: (state, action) => {
        const movieId = action.payload.movieId;
        const isFavorite = action.payload.isFavorite;
  
        if (isFavorite) {
          state.favorites = state.favorites.filter((id) => id !== movieId);
        } else {
          
          state.favorites.push(movieId);
        }
        localStorage.setItem('favoriteMovies', JSON.stringify(state.favorites));

      },
      setPage: (state, action) => {
        state.currentPage = action.payload;
      },
      selectCurrentPage:(state)=>state.movies.movie.currentPage,
      
      selectPageSize:(state)=>state.movies.movie.pageSize,
      restPages:(state)=>{state.currentPage=1},
      setRating:(state,action)=>{
        const {movieId,rating}=action.payload
        state.ratings[movieId]=rating
        localStorage.setItem("movieRatings",JSON.stringify(state.ratings))
      }
}
})







export const {filterByGenre,filterByTitle,clearFilters,
    setSearchFilter,clearGenre,toggleFavorite,setPage,selectCurrentPage,selectPageSize,
    selectTotalItems,restPages,setRating}=movieSlice.actions
export default movieSlice.reducer 