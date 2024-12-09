// src/api/candidates.js
import AuthInterceptor from "../auth/AuthInterceptor";

export const fetchCandidates = async (filters) => {
    const axiosInstance = AuthInterceptor.getInstance();
  
    try {
      const  data  = await axiosInstance.get('/candidates', {
        params: {
          ...filters,  // Spread all filter parameters
        },
      });
  
      // Log the API response for debugging

      return data || []; // Return the data or an empty array if data is undefined
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error; // Throw the error to let React Query handle it
    }
  };
