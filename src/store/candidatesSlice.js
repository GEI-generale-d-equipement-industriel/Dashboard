import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthInterceptor from "../services/auth/AuthInterceptor";


// Thunk to fetch candidates from API
export const fetchCandidates = createAsyncThunk(
  "candidates/fetchCandidates",
  async ({ sortBy, sortOrder } = {}, { rejectWithValue }) => { // Default to an empty object
    try {
      const axiosInstance = AuthInterceptor.getInstance();
      const response = await axiosInstance.get('/candidates', {
        params: {
          ...(sortBy && { sortBy }), // Include sortBy if defined
          ...(sortOrder && { sortOrder }) // Include sortOrder if defined
        }
      });
      return response; // Ensure you return the data array
    } catch (error) {
      console.error("API request failed", error);
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
    selectedAgeRange: [0, 60], 
    selectedHeightRange: [0.5, 2.5], 
    selectedWeightRange: [5, 120],
    selectedSex: [],
    searchTerm: "",
    selectedEyeColor: '',
    selectedHairColor: '',
    selectedHairType: '',
    selectedSkinColor: '',
    selectedFacialHair: '',
    selectedSign: [],
    selectedTown: '',
    selectedRegistrationType: '',
    selectedVeilStatus:false,
    selectedPregnancyStatus:false,
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
    filterByHeight: (state, action) => {
      state.selectedHeightRange = action.payload; // New height filter
      applyFilters(state);
    },

    filterByWeight: (state, action) => {
      state.selectedWeightRange = action.payload; // New weight filter
      applyFilters(state);
    },

    filterBySex: (state, action) => {
      state.selectedSex = action.payload;
      applyFilters(state);
    },
    filterByEyeColor: (state, action) => {
      state.selectedEyeColor = action.payload;
      applyFilters(state);
    },

    filterByHairColor: (state, action) => {
      state.selectedHairColor = action.payload;
      applyFilters(state);
    },

    filterByRegistrationType: (state, action) => {
      state.selectedRegistrationType = action.payload; // Set the selected registration type
      applyFilters(state); // Call applyFilters to filter the candidates based on the selected registration type
    },

    filterByHairType: (state, action) => {
      state.selectedHairType = action.payload;
      applyFilters(state);
    },

    filterBySkinColor: (state, action) => {
      state.selectedSkinColor = action.payload;
      applyFilters(state);
    },

    filterByFacialHair: (state, action) => {
      state.selectedFacialHair = action.payload;
      applyFilters(state);
    },

    filterBySign: (state, action) => {
      state.selectedSign = action.payload;
      applyFilters(state);
    },

    filterByTown: (state, action) => {
      state.selectedTown = action.payload;
      applyFilters(state);
    },
    filterByVeilStatus: (state, action) => {
      state.selectedVeilStatus = action.payload;
      applyFilters(state);
    },

    filterByPregnancyStatus: (state, action) => {
      state.selectedPregnancyStatus = action.payload;
      applyFilters(state);
    },


    clearFilters: (state) => {
      state.searchTerm = '';
      state.selectedInterests = [];
      state.selectedAgeRange = [0, 60];
      state.selectedHeightRange = [0.5, 2.5]; // Reset height range
      state.selectedWeightRange = [5, 120];
      state.selectedSex = [];
      state.selectedEyeColor = '';
      state.selectedHairColor = '';
      state.selectedHairType = '';
      state.selectedSkinColor = '';
      state.selectedFacialHair = '';
      state.selectedSign = [];
      state.selectedTown = '';
      state.selectedRegistrationType = '';
      state.selectedPregnancyStatus=false;
      state.selectedVeilStatus=false;
      
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

  if (state.selectedRegistrationType === 'Enfant') {
    
    
    filteredCandidates = filteredCandidates.filter(candidate => candidate.registrationType === 'enfant'); 
    
    
  } else if (state.selectedRegistrationType === 'Adulte') {
    filteredCandidates = filteredCandidates.filter(candidate => candidate.registrationType === 'moi');
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
  // Height Filter
  if (state.selectedHeightRange.length === 2) {
    const [minHeight, maxHeight] = state.selectedHeightRange;
    filteredCandidates = filteredCandidates.filter((candidate) => {
      const height = parseFloat(candidate.height);
      return height >= minHeight && height <= maxHeight;
    });
  }

  // Weight Filter
  if (state.selectedWeightRange.length === 2) {
    const [minWeight, maxWeight] = state.selectedWeightRange;
    filteredCandidates = filteredCandidates.filter((candidate) => {
      const weight = parseFloat(candidate.weight);
      return weight >= minWeight && weight <= maxWeight;
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
  if (state.selectedEyeColor) {
    const eyeColorLower = state.selectedEyeColor.toLowerCase();
    filteredCandidates = filteredCandidates.filter((candidate) => 
      (candidate.eyeColor || '').toLowerCase() === eyeColorLower
    );
  }

  // Hair Color Filter
  if (state.selectedHairColor) {
    const hairColorLower = state.selectedHairColor.toLowerCase();
    filteredCandidates = filteredCandidates.filter((candidate) => 
      (candidate.hairColor || '').toLowerCase() === hairColorLower
    );
  }

  // Hair Type Filter
  if (state.selectedHairType) {
    const hairTypeLower = state.selectedHairType.toLowerCase();
    filteredCandidates = filteredCandidates.filter((candidate) => 
      (candidate.hairType || '').toLowerCase() === hairTypeLower
    );
  }

  // Skin Color Filter
  if (state.selectedSkinColor) {
    const skinColorLower = state.selectedSkinColor.toLowerCase();
    filteredCandidates = filteredCandidates.filter((candidate) => 
      (candidate.skinColor || '').toLowerCase() === skinColorLower
    );
  }

  // Facial Hair Filter
  if (state.selectedFacialHair) {
    const facialHairLower = state.selectedFacialHair.toLowerCase();
    filteredCandidates = filteredCandidates.filter((candidate) => 
      (candidate.facialHair || '')=== facialHairLower
    );
  }

  // Sign Filter
  if (state.selectedSign.length > 0) {
    const selectedSignsLower = state.selectedSign.map((sign) => sign.trim().toLowerCase());
    filteredCandidates = filteredCandidates.filter((candidate) => {
      const candidateSigns = candidate.sign ? candidate.sign.map((sign) => sign.trim().toLowerCase()) : [];
      return selectedSignsLower.every((sign) => candidateSigns.includes(sign));
    });
  }

  // Town Filter
  if (state.selectedTown) {
    const townLower = state.selectedTown.toLowerCase();
    filteredCandidates = filteredCandidates.filter((candidate) => 
      (candidate.town || '').toLowerCase() === townLower
    );
  }

  if (state.selectedVeilStatus) {
    filteredCandidates = filteredCandidates.filter((candidate) => 
      candidate.veiled === state.selectedVeilStatus
    );
  }

  // Pregnancy Status Filter
  if (state.selectedPregnancyStatus) {
    filteredCandidates = filteredCandidates.filter((candidate) => 
      candidate.pregnant === state.selectedPregnancyStatus
    );
  }
  state.filteredCandidates = filteredCandidates;
};

export const {
  filterByName,
  filterByInterest,
  filterByAge,
  filterBySex,
  filterByHeight,
  filterByWeight,
  filterByEyeColor,
  filterByHairColor,
  filterByHairType,
  filterBySkinColor,
  filterByFacialHair,
  filterBySign,
  filterByTown,
  filterByVeilStatus,
  filterByPregnancyStatus,
  clearFilters,
  restPages,
  setPage,
  setPageSize,
  toggleFavorite,
  filterByRegistrationType
} = candidateSlice.actions;

export default candidateSlice.reducer;
