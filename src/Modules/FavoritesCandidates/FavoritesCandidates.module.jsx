import React, {  useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useFetchFileLinks from '../../Hooks/useFetchFileLinks';
import { useFetchFavorites, useUpdateFavorites } from '../../services/api/favoritesService';


const FavoriteCandidates = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const userId = useSelector((state) => state.auth.id);

  // Fetch favorites (default to empty array if undefined)
  const { data: favoriteCandidates = [] } = useFetchFavorites(userId);
  // Fetch file links for all candidates at once
  const fileLinks = useFetchFileLinks(favoriteCandidates);

  const { mutate: updateFavorites } = useUpdateFavorites();
  const queryClient = useQueryClient();

  // Build an array of candidate IDs
  // const favoriteIds = useMemo(
  //   () => favoriteCandidates.map((fav) => fav._id),
  //   [favoriteCandidates]
  // );

  /**
   * Remove from Favorites (always remove, no add logic)
   */
  const handleRemoveFavorite = useCallback(
    (candidateId) => {
      // Optimistic update: Remove candidate from favorites locally
      const updatedFavorites = favoriteCandidates.filter(
        (fav) => fav._id !== candidateId
      );
      queryClient.setQueryData(['favorites', userId], updatedFavorites);
  
      // Actual API call to persist the removal
      updateFavorites(
        { userId, candidateId, action: 'remove' }, // Send single candidate update
        {
          onSuccess: () => {
            notificationApi.success({
              message: 'Removed from Favorites',
              description: 'This candidate has been successfully removed from your favorites list.',
              placement: 'topRight',
              duration: 2,
            });
          },
          onError: () => {
            // Revert the optimistic update on error
            queryClient.setQueryData(['favorites', userId], favoriteCandidates);
            notificationApi.error({
              message: 'Action Failed',
              description: 'An error occurred while removing the candidate from your favorites. Please try again.',
              placement: 'topRight',
              duration: 2,
            });
          },
        }
      );
    },
    [favoriteCandidates, notificationApi, updateFavorites, userId, queryClient]
  );
  

  /**
   * Optional: Download favorites as Excel
   */
 

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      {contextHolder}
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Favorites</h2>
          
        </div>

        {/* If no favorites, show message, else show grid */}
        {favoriteCandidates.length === 0 ? (
          <p className="text-center">No favorite candidates found.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
            {favoriteCandidates.map((candidate) => {
              const link = fileLinks[candidate._id];

              return (
                <div
                  key={candidate._id}
                  className="relative w-full pb-[100%] bg-gray-200 overflow-hidden group"
                >
                  {/* Full-area Link for navigation */}
                  <Link
                    to={`/candidate/${candidate._id}`}
                    className="absolute inset-0 z-10 block w-full h-full"
                  />

                  {/* Candidate image or fallback */}
                  {link ? (
                    <img
                      src={link}
                      alt={candidate.name || 'Candidate'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-500 flex items-center justify-center text-white text-sm">
                      {candidate.name || 'No Image'}
                    </div>
                  )}

                  {/* Hover overlay (no pointer events => the Link behind is clickable) */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/40
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                      flex
                      items-center
                      justify-center
                      pointer-events-none
                      z-30
                    "
                  >
                    {/* The delete button is clickable => pointer-events: auto */}
                   
                    <Button
                      icon={<DeleteOutlined style={{ fontSize: '1.2rem' }} />}
                      shape="circle"
                      className="pointer-events-auto border-white text-gray hover:bg-gray/20"
                      onClick={(e) => {
                        e.preventDefault(); // prevent Link click
                        handleRemoveFavorite(candidate._id);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(FavoriteCandidates);
  