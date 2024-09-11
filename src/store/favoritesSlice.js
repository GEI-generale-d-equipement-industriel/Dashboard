import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthInterceptor from "../services/auth/AuthInterceptor";

// Thunk to fetch user favorites
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (userId, { rejectWithValue }) => {
    try {
      const axiosInstance = AuthInterceptor.getInstance();
      const response = await axiosInstance.get(`/user/${userId}/favorites`);
      
      return response; // Ensure response data is the array of favorite candidate IDs
    } catch (error) {
      console.error("Failed to fetch favorites", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to update user favorites
export const updateFavorites = createAsyncThunk(
  "favorites/updateFavorites",
  async ({ userId, favorites }, { rejectWithValue }) => {
    try {
      const axiosInstance = AuthInterceptor.getInstance();
      const favoriteIds = favorites.map(fav => fav._id || fav);
      const response = await axiosInstance.put(`/user/${userId}/favorites`, { favorites: favoriteIds });
      
      
      return "Candidate added to the favorites list "; // Ensure response data is the updated array of favorite candidate IDs
    } catch (error) {
      console.error("Failed to update favorites", error);
      return rejectWithValue(error.response.data);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: [],
    status: "idle",
    error: null,
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const candidateId = action.payload;
    
      // Ensure we are working with candidate objects and not just IDs
      const isFavorite = state.favorites.some(candidate => candidate._id === candidateId);
    
      if (isFavorite) {
        state.favorites = state.favorites.filter(candidate => candidate._id !== candidateId);
      } else {
        // Add a placeholder object with the candidate's ID (or fetch candidate data first)
        state.favorites = [...state.favorites, { _id: candidateId }];
      }
      
      console.log("Updated favorites: ", state.favorites);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.favorites = action.payload;
      })
      .addCase(updateFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Combined action to toggle favorite and update backend
// export const toggleFavoriteWithAPI = (userId, candidateId) => async (dispatch, getState) => {
//   const { favorites } = getState().favorites;
//   const favoriteIds = favorites.map(candidate => candidate._id || candidate);
//   const isFavorite = favoriteIds.includes(candidateId);
//   let updatedFavorites;
  
//   if (isFavorite) {
//     // Remove candidate from favorites
//     updatedFavorites = favorites.filter(id => id !== candidateId);
//   } else {
//     // Add candidate to favorites
//     updatedFavorites = [...favorites, candidateId];
//   }
  
//   // Dispatch the local toggle action
//   dispatch(favoritesSlice.actions.toggleFavorite(candidateId));
  
//   try {
//     // Call the updateFavorites thunk to sync with the backend
//     await dispatch(updateFavorites({ userId, favorites: updatedFavorites })).unwrap();
//   } catch (error) {
//     console.error('Error dispatching updateFavorites:', error);
//   }
// };


export const { toggleFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
