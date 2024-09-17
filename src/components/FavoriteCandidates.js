import React, { useEffect, useMemo, useCallback,useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Typography, Row, Col, notification, Skeleton, Divider, Tag } from 'antd';
import { IoIosRemoveCircleOutline } from "react-icons/io";
import CandidateCard from './CandidateCard';
import { fetchFavorites } from '../store/favoritesSlice'; // Import the thunk
import * as XLSX from 'xlsx';
import { toggleFavorite } from '../services/api/favoritesService';
const { Meta } = Card;
const { Title } = Typography;
const url = "http://localhost:3002";

const FavoriteCandidates = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const userId = useSelector((state) => state.auth.id);
  const dispatch = useDispatch();
  const favoriteCandidates = useSelector((state) => state.favorites.favorites);
  const status = useSelector((state) => state.favorites.status);
  const [fileLinks, setFileLinks] = useState({});
    
  useEffect(() => {
    if (userId) {
      dispatch(fetchFavorites(userId));
    }
  }, [userId, dispatch]);

  const favoriteIds = useMemo(() => {
    return Array.isArray(favoriteCandidates)
      ? favoriteCandidates.map((fav) => fav._id || fav)
      : [];
  }, [favoriteCandidates]);


  const handleLikeToggle = useCallback(
    async (candidateId) => {
      try {
        await dispatch(toggleFavorite(candidateId));

        // Show notification on success
        const isFavorite = favoriteIds.includes(candidateId);
        notificationApi.success({
          message: isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
          description: isFavorite
            ? 'This candidate has been removed from your favorites list.'
            : 'This candidate has been added to your favorites list.',
          placement: 'topRight',
          duration: 2,
        });
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        notificationApi.error({
          message: 'Action Failed',
          description:
            'There was an error while updating favorites. Please try again.',
          placement: 'topRight',
          duration: 2,
        });
      }
    },
    [dispatch, favoriteIds, notificationApi]
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
) : favoriteCandidates.length > 0 ? (
  favoriteCandidates.map((candidate) => (
    <Col xs={24} sm={12} md={8} lg={6} key={candidate._id}>
      <CandidateCard
        candidate={candidate}
        isFavorite={true}
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
