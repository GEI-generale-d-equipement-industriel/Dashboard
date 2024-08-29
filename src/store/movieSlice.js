import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch candidates from API
export const fetchCandidates = createAsyncThunk(
  "candidates/fetchCandidates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://192.168.1.114:5000/api/candidates");
      return response.data;
    } catch (error) {
      console.error("API request failed", error);  // Log the error
      return rejectWithValue(error.response.data);
    }
  }
);

const candidateSlice = createSlice({
  name: "candidates",
  initialState: {
    candidates: [],
    filteredCandidates: [],
    favorites: JSON.parse(localStorage.getItem("favoriteCandidates")) || [],
    selectedInterests: [],
    selectedAgeRange: "",
    selectedSex: "",
    searchTerm: "",
    currentPage: 1,
    pageSize: 8,
    status: "idle",
    error: null,
  },
  
  reducers: {
    filterByName: (state, action) => {
      state.searchTerm = action.payload;
      applyFilters(state);
    },

    filterByInterest: (state, action) => {
      let selectedInterests = [];
    
      if (Array.isArray(action.payload)) {
        selectedInterests = action.payload.map(interest => interest.trim());
      } else if (typeof action.payload === 'string') {
        selectedInterests = action.payload.split(',').map(interest => interest.trim());
      }
    
      console.log(selectedInterests, 'selectedInterests'); // Debugging output
      state.selectedInterests = selectedInterests; // Use the correct state property
      console.log(state.selectedInterests, 'updated state.selectedInterests'); // Ensure state is updated
      applyFilters(state);
    },
    

    filterByAge: (state, action) => {
      state.selectedAgeRange = action.payload;
      applyFilters(state);
    },
    filterBySex: (state, action) => {
      state.selectedSex = action.payload;
      applyFilters(state);
    },
    clearFilters: (state) => {
      state.selectedInterest = [];
      state.selectedAgeRange = '';
      state.selectedSex = '';
      state.searchTerm = '';
      state.filteredCandidates = state.candidates;
    },
    restPages: (state) => {
      state.currentPage = 1;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    toggleFavorite: (state, action) => {
      const candidateId = action.payload;
      const isFavorite = state.favorites.includes(candidateId);
    
      if (isFavorite) {
        state.favorites = state.favorites.filter(id => id !== candidateId);
      } else {
        state.favorites.push(candidateId);
      }
    
      localStorage.setItem("favoriteCandidates", JSON.stringify(state.favorites));
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.candidates = action.payload;
        state.filteredCandidates = action.payload; // Set filtered candidates to all initially
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Apply all filters based on current state
const applyFilters = (state) => {
  let filteredCandidates = state.candidates;

  if (state.searchTerm) {
    filteredCandidates = filteredCandidates.filter(candidate =>
      candidate.name.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }

   if (state.selectedInterests.length > 0) {
    filteredCandidates = filteredCandidates.filter(candidate => {
      return state.selectedInterests.every(interest => {
        // Ensure the candidate's interests contain all selected interests
        console.log(candidate.interest);
        
        return candidate.interest.includes(interest);
      });
    });
  }

  if (state.selectedAgeRange) {
    const [minAge, maxAge] = state.selectedAgeRange.split('-').map(Number);
    const currentYear = new Date().getFullYear();
    filteredCandidates = filteredCandidates.filter(candidate => {
      const age = currentYear - candidate.birthYear;
      return (minAge <= age && (maxAge ? age <= maxAge : true));
    });
  }

  if (state.selectedSex) {
    filteredCandidates = filteredCandidates.filter(candidate =>
      candidate.gender === state.selectedSex
    );
  }

  state.filteredCandidates = filteredCandidates;
  console.log(state.filteredCandidates, 'filteredCandidates');
};

export const {
  filterByName,
  filterByInterest,
  filterByAge,
  filterBySex,
  clearFilters,
  restPages,
  setPage,
  toggleFavorite
} = candidateSlice.actions;

export default candidateSlice.reducer;
