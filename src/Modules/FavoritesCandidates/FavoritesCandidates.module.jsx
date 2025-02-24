import React from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import useFetchFileLinks from '../../Hooks/useFetchFileLinks';
import { useFetchFavorites, useUpdateFavorites } from '../../services/api/favoritesService';
import CandidateGrid from '../../components/Cards/CandidateGrid';


const FavoriteCandidates = () => {

  const userId = useSelector((state) => state.auth.id);

  // Fetch favorites (default to empty array if undefined)
  const { data: favoriteCandidates = [] } = useFetchFavorites(userId);
  // Fetch file links for all candidates at once
  const fileLinks = useFetchFileLinks(favoriteCandidates);

  const { mutate: updateFavorites } = useUpdateFavorites();
  const queryClient = useQueryClient();


  /**
   * Remove from Favorites (always remove, no add logic)
   */
  const handleRemoveCandidate = (candidateId, { onSuccess, onError }) => {
    const updatedFavorites = favoriteCandidates.filter(
      (fav) => fav._id !== candidateId
    );
    queryClient.setQueryData(['favorites', userId], updatedFavorites);

    updateFavorites(
      { userId, candidateId, action: 'remove' },
      {
        onSuccess,
        onError: () => {
          queryClient.setQueryData(['favorites', userId], favoriteCandidates);
          onError();
        },
      }
    );
  };
  

  /**
   * Optional: Download favorites as Excel
   */
 
  
  return (
    <CandidateGrid
    candidates={favoriteCandidates}
    fileLinks={fileLinks}
    onRemoveCandidate={handleRemoveCandidate}
    title="My Favorites"
    emptyMessage="No favorite candidates found."
  />
  );
};

export default React.memo(FavoriteCandidates);
  