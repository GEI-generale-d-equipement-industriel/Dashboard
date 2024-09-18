// services/favoritesService.js
import { updateFavorites, fetchFavorites } from '../../store/favoritesSlice';
import { toggleFavorite as toggleFavoriteAction } from '../../store/favoritesSlice';



export const toggleFavorite = (userId, candidateId) => async (dispatch, getState) => {
  const { favorites } = getState().favorites;
  const favoriteIds = favorites.map(candidate => candidate._id || candidate);
  const isFavorite = favoriteIds.includes(candidateId);
  
  
  // Update the local favorites state
  const updatedFavorites = isFavorite
    ? favorites.filter(candidate => candidate._id !== candidateId)
    : [...favorites, { _id: candidateId }];

  dispatch(toggleFavoriteAction(candidateId));
  
  try {
    // Update the backend and refetch favorites
    await dispatch(updateFavorites({ userId, favorites: updatedFavorites }));
    await dispatch(fetchFavorites(userId));
  } catch (error) {
    console.error('Failed to update favorites:', error);
  }
};
