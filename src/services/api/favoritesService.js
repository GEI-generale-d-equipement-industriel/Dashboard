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
    mutationFn: async ({ userId, favorites }) => {
      const favoriteIds = favorites.map((fav) => fav._id || fav);
      const { data } = await axios.put(`${url}/user/${userId}/favorites`, {
        favorites: favoriteIds,
      });
      return data.favorites;
    },
    onMutate: async ({ userId, favorites }) => {
      await queryClient.cancelQueries(['favorites', userId]);

      const previousFavorites = queryClient.getQueryData(['favorites', userId]);

      queryClient.setQueryData(['favorites', userId], favorites);

      return { previousFavorites };
    },
    onError: (error, variables, context) => {
      const { userId } = variables;
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites', userId], context.previousFavorites);
      }
    },
    onSettled: (data, error, variables) => {
      const { userId } = variables;  
      queryClient.invalidateQueries(['favorites', userId]);
    },
  });
};

