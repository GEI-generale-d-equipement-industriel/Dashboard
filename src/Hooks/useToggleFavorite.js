import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { notification } from 'antd';
import { useUpdateFavorites } from '../services/api/favoritesService';

const useToggleFavorite = (userId, favoriteCandidates = []) => {
  const queryClient = useQueryClient();
  const { mutate: updateFavorites } = useUpdateFavorites();

  const toggleFavorite = useCallback(
    ({ candidateId, action }) => {
        
        
      if (!candidateId || !['add', 'remove'].includes(action)) {
        console.error('Invalid action or candidate ID', { candidateId, action });
        return;
      }

      // Determine optimistic update based on action
      const updatedFavorites =
        action === 'add'
          ? [...favoriteCandidates, { _id: candidateId }]
          : favoriteCandidates.filter((fav) => fav._id !== candidateId);

      // Optimistically update the cache
      queryClient.setQueryData(['favorites', userId], updatedFavorites);

      // Actual API call
      updateFavorites(
        { userId, candidateId, action },
        {
          onSuccess: () => {
            const actionMessage =
              action === 'add' ? 'added to' : 'removed from';
            notification.success({
              message: `Favorites Updated`,
              description: `The candidate was successfully ${actionMessage} your favorites list.`,
              placement: 'topRight',
              duration: 2,
            });
          },
          onError: () => {
            // Revert the optimistic update on error
            queryClient.setQueryData(['favorites', userId], favoriteCandidates);
            notification.error({
              message: `Action Failed`,
              description: `An error occurred while trying to ${action === 'add' ? 'add' : 'remove'} the candidate. Please try again.`,
              placement: 'topRight',
              duration: 2,
            });
          },
        }
      );
    },
    [favoriteCandidates, queryClient, updateFavorites, userId]
  );

  return toggleFavorite;
};

export default useToggleFavorite;
