import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthInterceptor from "../services/auth/AuthInterceptor";


// Thunk to fetch candidates from API
export const fetchCandidates = createAsyncThunk(
  "candidates/fetchCandidates",
  async (_, { rejectWithValue }) => {
    try {
      const axiosInstance = AuthInterceptor.getInstance();
      const response = await axiosInstance.get('/candidates');
      return response;
    } catch (error) {
      console.error("API request failed", error); // Log the error
      return rejectWithValue(error.response?.data || 'Server Error');
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
    selectedSex: [],
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
      state.selectedInterests = action.payload;
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
      state.searchTerm = '';
      state.selectedInterests = [];
      state.selectedAgeRange = [0, 60];
      state.selectedSex = [];
      applyFilters(state);
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
  let filteredCandidates = [...state.candidates];

  // Search Term Filter
  if (state.searchTerm) {
    const searchTermLower = state.searchTerm.toLowerCase();
    filteredCandidates = filteredCandidates.filter((candidate) => {
      const fullName = `${candidate.firstName} ${candidate.name}`.toLowerCase();
      return fullName.includes(searchTermLower);
    });
  }

  // Interest Filter
  if (state.selectedInterests.length > 0) {
    const selectedInterestsLower = state.selectedInterests.map((interest) =>
      interest.trim().toLowerCase()
    );
  
    filteredCandidates = filteredCandidates.filter((candidate) => {
      // Ensure candidate.interest is an array or split if it's a string interest

      const candidateInterests = Array.isArray(candidate.interest)
      ? candidate.interest.flatMap((interest) => 
          interest.includes(",") 
            ? interest.split(",").map((i) => i.trim().toLowerCase()) 
            : [interest.trim().toLowerCase()]
        )
      : candidate.interest
          .split(',')
          .map((interest) => interest.trim().toLowerCase()); 
      console.log("the intrest",candidateInterests);
      console.log("the selected intrest",selectedInterestsLower)
      
      return selectedInterestsLower.every((interest) =>
        candidateInterests.includes(interest)
      );
    });
  }
  

  // Age Filter
  if (state.selectedAgeRange.length === 2) {
    const [minAge, maxAge] = state.selectedAgeRange;
    filteredCandidates = filteredCandidates.filter((candidate) => {
      if (!candidate.birthYear) return false;
      const currentYear = new Date().getFullYear();
      const age = currentYear - candidate.birthYear;
      return age >= minAge && age <= maxAge;
    });
  }

  // Sex Filter
  if (state.selectedSex.length > 0) {
    const selectedGenders = state.selectedSex.map((sex) => sex.trim().toLowerCase());
  
    filteredCandidates = filteredCandidates.filter((candidate) => {
      const candidateGender = candidate.gender.trim().toLowerCase();
      return selectedGenders.includes(candidateGender);
    });
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
