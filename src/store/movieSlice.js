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
},
reducers:{
    addToFavorites:(state,action)=>{
        const movieId=action.payload
        const movie =state.movie.find((m)=>m.id===movieId)
        if(movie){
            if(!state.favorites.includes(movieId)){
                state.favorites.push(movieId)
            }
        }
    },
    removeFromFavorites:(state,action)=>{
        const movieId=action.payload
        const index=state.favorites.indexOf(movieId)

        if(index!==-1){
            state.favorites.splice(index,1)
        }
    },
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
          // Remove from favorites
          state.favorites = state.favorites.filter((id) => id !== movieId);
        } else {
          // Add to favorites
          state.favorites.push(movieId);
        }
        localStorage.setItem('favoriteMovies', JSON.stringify(state.favorites));

      },
      setPage: (state, action) => {
        state.currentPage = action.payload;
      },
      selectCurrentPage:(state)=>state.movies.movie.currentPage,
      
      selectPageSize:(state)=>state.movies.movie.pageSize,
      restPages:(state)=>{state.currentPage=1}
}
})







export const {addToFavorites,removeFromFavorites,filterByGenre,filterByTitle,clearFilters,
    setSearchFilter,clearGenre,toggleFavorite,setPage,selectCurrentPage,selectPageSize,
    selectTotalItems,restPages}=movieSlice.actions
export default movieSlice.reducer 