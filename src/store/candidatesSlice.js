import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const url = "http://localhost:3002";

// Thunk to fetch candidates from API
export const fetchCandidates = createAsyncThunk(
  "candidates/fetchCandidates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/candidates`);
      return response.data;
    } catch (error) {
      console.error("API request failed", error); // Log the error
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
    selectedAgeRange: [0, 60], // Adjusted to handle a range as an array [min, max]
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
      state.selectedInterests = Array.isArray(action.payload)
        ? action.payload.map((interest) => interest.trim())
        : action.payload.split(",").map((interest) => interest.trim());
      applyFilters(state);
    },

    filterByAge: (state, action) => {
      state.selectedAgeRange = action.payload; // Expecting an array [min, max]
      applyFilters(state);
    },

    filterBySex: (state, action) => {
      state.selectedSex = action.payload;
      applyFilters(state);
    },

    clearFilters: (state) => {
      state.selectedInterests = [];
      state.selectedAgeRange = [0, 60]; // Reset to default range
      state.selectedSex = "";
      state.searchTerm = "";
      applyFilters(state); // Reapply with cleared filters
    },

    restPages: (state) => {
      state.currentPage = 1;
    },

    setPage: (state, action) => {
      state.currentPage = action.payload;
    },

    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to the first page when page size changes
    },

    toggleFavorite: (state, action) => {
      const candidateId = action.payload;
      const isFavorite = state.favorites.includes(candidateId);

      if (isFavorite) {
        state.favorites = state.favorites.filter((id) => id !== candidateId);
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
    filteredCandidates = filteredCandidates.filter((candidate) => {
      return (
        candidate.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        candidate.firstName.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    });
  }

  if (state.selectedInterests.length > 0) {
    filteredCandidates = filteredCandidates.filter((candidate) => {
      const candidateInterests = candidate.interest.split(",").map((interest) => interest.trim());

      // Ensure all selected interests are exactly matched in candidate's interests
      return candidateInterests.length === state.selectedInterests.length &&
        state.selectedInterests.every((interest) => candidateInterests.includes(interest));
    });
  }

  if (state.selectedAgeRange.length === 2) {
    const [minAge, maxAge] = state.selectedAgeRange;
    filteredCandidates = filteredCandidates.filter((candidate) => {
      const currentYear = new Date().getFullYear();
      const age = currentYear - candidate.birthYear;
      return age >= minAge && age <= maxAge;
    });
  }

  if (state.selectedSex) {
    filteredCandidates = filteredCandidates.filter((candidate) =>
      candidate.gender.includes(state.selectedSex)
    );
  }

  state.filteredCandidates = filteredCandidates;
};

export const {
  filterByName,
  filterByInterest,
  filterByAge,
  filterBySex,
  clearFilters,
  restPages,
  setPage,
  setPageSize,
  toggleFavorite,
} = candidateSlice.actions;

export default candidateSlice.reducer;
