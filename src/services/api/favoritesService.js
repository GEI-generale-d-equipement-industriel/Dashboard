import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const url = process.env.REACT_APP_API_BASE_URL || '/api';

// Fetch user's favorite candidates
export const fetchFavorites = async (userId) => {
  const { data } = await axios.get(`${url}/user/${userId}/favorites`);
  return data;
};

// Update user's favorite candidates
export const updateFavorites = async ({ userId, favorites }) => {

  
  const favoriteIds = favorites.map(fav => fav._id || fav);
  const { data } = await axios.put(`${url}/user/${userId}/favorites`, { favorites: favoriteIds });
  return data.favorites;
};

// Custom hook to fetch favorites
export const useFetchFavorites = (userId) => {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => fetchFavorites(userId),
    enabled: !!userId, // Ensures that query only runs when userId is available
  });
};

// Custom hook to update favorites
export const useUpdateFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Now we accept a single candidate with { candidateId, action }
    mutationFn: async ({ userId, candidateId, action }) => {
      const { data } = await axios.put(`${url}/user/${userId}/favorites`, {
        candidateId,
        action,
      });
      return data; // { message, favorites, length }
    },
    onMutate: async (variables) => {
      // e.g.  { userId, candidateId, action }
      await queryClient.cancelQueries(['favorites', variables.userId]);
      const previousFavorites = queryClient.getQueryData(['favorites', variables.userId]);
      return { previousFavorites };
    },
    onError: (error, variables, context) => {
      // Revert
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites', variables.userId], context.previousFavorites);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(['favorites', variables.userId]);
    },
  });
};


