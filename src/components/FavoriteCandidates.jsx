import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button, Typography, Row, Col, notification, Skeleton } from 'antd';
import CandidateCard from './CandidateCard';
import {  useQueryClient } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import useFetchFileLinks from '../Hooks/useFetchFileLinks';
import { useFetchFavorites, useUpdateFavorites } from '../services/api/favoritesService';

const { Title } = Typography;
  

const FavoriteCandidates = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const userId = useSelector((state) => state.auth.id);

  const { data: favoriteCandidates, isLoading, isError } = useFetchFavorites(userId);

  const { mutate: updateFavorites } = useUpdateFavorites();
  
  const queryClient = useQueryClient();
  // const favoriteCandidates = useSelector((state) => state.favorites.favorites);
  const status = useSelector((state) => state.favorites.status);

  const fileLinks = useFetchFileLinks(favoriteCandidates || []);


 

  


  const favoriteIds = useMemo(
    () =>
      favoriteCandidates.map((fav) => fav._id),
    [favoriteCandidates]
  );


  const handleLikeToggle = useCallback(
    (candidateId) => {
      const isFavorite = favoriteIds.includes(candidateId);
  
      // Optimistically update the favorites list
      const updatedFavorites = isFavorite
        ? favoriteCandidates.filter((fav) => fav._id !== candidateId)
        : [...favoriteCandidates, { _id: candidateId }];
  
      // Optimistically update the local cache
      queryClient.setQueryData(['favorites', userId], updatedFavorites);
   
      // Make the API call to update favorites
      updateFavorites(
        { userId, favorites: updatedFavorites },
        {
          onSuccess: () => {
            notificationApi.success({
              message: isFavorite ? "Removed from Favorites" : "Added to Favorites",
              description: isFavorite
                ? "This candidate has been removed from your favorites list."
                : "This candidate has been added to your favorites list.",
              placement: "topRight",
              duration: 2,
            });
          },
          onError: (error) => {
            // Revert to the previous state on error
            queryClient.setQueryData(['favorites', userId], favoriteCandidates);
  
            notificationApi.error({
              message: 'Action Failed',
              description:
                'There was an error while updating favorites. Please try again.',
              placement: 'topRight',
              duration: 2,
            });
          },
        }
      );
    },
    [favoriteCandidates, favoriteIds, notificationApi, updateFavorites, userId, queryClient]
  );
  

  const downloadXLSX = () => {
    const worksheetData = [
      ["Name", "Gender", "Birth Year", "Interest", "Phone Number", "Files"], // Header row
      ...favoriteCandidates.map(candidate => [
        `${candidate.name} ${candidate.firstName}`,
        candidate.gender,
        candidate.birthYear,
        candidate.interest,
        candidate.phone,
        candidate.files.map(file => `${file.filename}`).join(', ') // Convert the array of files to a comma-separated string
      ])
    ];
  
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
    // Style the header row
    const headerCellStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "FFAA00" } }, // Orange background color
      alignment: { horizontal: "center" }
    };
  
    // Apply the style to each header cell
    ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'].forEach(cell => {
      worksheet[cell].s = headerCellStyle;
    });
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Favorites");
  
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'favorite_candidates.xlsx');
  };
  
  

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      {contextHolder} {/* Place the notification container here */}
      <div className="container mx-auto px-4">
        <Title level={2} className="text-center mb-8">Favorite Candidates</Title>

        <div className="flex justify-end mb-4">
          <Button 
            type="primary" 
            onClick={downloadXLSX} 
            className="bg-blue-500 border-blue-500 text-white font-bold text-lg py-2 px-4 hover:bg-blue-600 hover:border-blue-600"
          >
            Download as Excel
          </Button>
        </div>

        <Row gutter={[16, 24]}>
        {status === 'loading' ? (
  [...Array(6)].map((_, index) => (
    <Col xs={24} sm={12} md={8} lg={6} key={index}>
      <Skeleton active>
        <CandidateCard loading />
      </Skeleton>
    </Col>
  ))  
) : favoriteCandidates?.length > 0 ? (
  favoriteCandidates?.map((candidate) => (
    <Col xs={24} sm={12} md={8} lg={6} key={candidate._id}>
      
      <CandidateCard
        candidate={candidate}
        isFavorite={true}
        fileLink={fileLinks[candidate._id]}

        onToggleFavorite={handleLikeToggle}
        tagColors={['orange', 'red', 'purple', 'gold']}
      />
    </Col>
  ))
) : (
  <div className="text-center w-full">
    <p>No favorite candidates found.</p>
  </div>
)}
        </Row>
      </div>
    </div>
  );
};

export default React.memo(FavoriteCandidates);
