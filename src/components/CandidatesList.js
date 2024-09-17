import React, { useMemo, useEffect, useState,useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Typography, Row, Col, Tag, Divider, Skeleton, notification } from 'antd';
import { fetchCandidates } from '../store/candidatesSlice';
import { toggleFavorite } from '../services/api/favoritesService';
import Pagination from './Pagination';
import axios from 'axios';
import CandidateCard from './CandidateCard';
import isEqual from 'lodash/isEqual';
import useFetchFileLinks from '../Hooks/useFetchFileLinks';

const { Meta } = Card;
const { Title } = Typography;

const url = "http://localhost:3002"; // Update this to your actual backend API base URL

// Validate Google Drive URL
const isValidGoogleDriveUrl = (url) => {
  const driveFileRegex = /^(https:\/\/)?(www\.)?(drive|docs)\.google\.com\/(file\/d\/|drive\/folders\/|open\?id=)[\w-]+/;
  return driveFileRegex.test(url);
};

function CandidateList() {
  const [notificationApi, contextHolder] = notification.useNotification();
  // const [fileLinks, setFileLinks] = useState({});

  const favorites = useSelector((state) => state.favorites.favorites);
  const filteredCandidates = useSelector((state) => state.candidates.filteredCandidates);
  const status = useSelector((state) => state.candidates.status);
  const userId = useSelector((state) => state.auth.id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const pageSize = useSelector((state) => state.candidates.pageSize);
  const currentPage = useSelector((state) => state.candidates.currentPage);

  const candidatesForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCandidates.slice(startIndex, endIndex);
  }, [filteredCandidates, currentPage, pageSize]);

  // Update useEffect to use candidatesForCurrentPage
  // useEffect(() => {
  //   const fetchFileLinks = async () => {
  //     try {
  //       const updatedFileLinks = {};

  //       await Promise.all(
  //         candidatesForCurrentPage.map(async (candidate) => {
  //           if (candidate.files && candidate.files.length > 0) {
  //             let imageFound = false;

  //             for (const file of candidate.files) {
  //               let fileLink = '';
  //               if (typeof file === 'string') {
  //                 fileLink = file;
  //               } else if (file.filename) {
  //                 fileLink = file.filename;
  //               } else if (file.link) {
  //                 fileLink = file.link;
  //               } else {
  //                 continue; // Skip this file
  //               }

  //               if (isValidGoogleDriveUrl(fileLink)) {
  //                 try {
  //                   const response = await axios.get(`${url}/google-drive/files`, {
  //                     params: { link: fileLink },
  //                   });

  //                   const imageFiles = response.data.filter(
  //                     (file) => file.contentType && file.contentType.startsWith('image/')
  //                   );

  //                   if (imageFiles.length > 0) {
  //                     // Store the first image file
  //                     updatedFileLinks[candidate._id] = imageFiles[0];
  //                     imageFound = true;
  //                     break; // Exit the loop since we found an image
  //                   }
  //                 } catch (error) {
  //                   console.error(
  //                     `Error fetching files for candidate ${candidate._id}:`,
  //                     error
  //                   );
  //                 }
  //               }
  //             }

  //             if (!imageFound) {
  //               // Optionally handle candidates with no images
  //             }
  //           }
  //         })
  //       );

  //       // Update state only if fileLinks have changed
  //       setFileLinks((prevFileLinks) => {
  //         if (!isEqual(prevFileLinks, updatedFileLinks)) {
  //           return updatedFileLinks;
  //         }
  //         return prevFileLinks;
  //       });
  //     } catch (error) {
  //       console.error('Error in fetchFileLinks:', error);
  //     }
  //   };

  //   fetchFileLinks();
  // }, [candidatesForCurrentPage]);
  
  const fileLinks = useFetchFileLinks(candidatesForCurrentPage);
  const favoriteIds = useMemo(() => {
    return Array.isArray(favorites) ? favorites.map((fav) => fav._id || fav) : [];
  }, [favorites]);


  const handleLikeToggle = useCallback(
    async (candidateId) => {
      try {
        await dispatch(toggleFavorite(userId, candidateId));
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
    [dispatch, userId, favoriteIds, notificationApi]
  );

  
  const tagColors = ['orange', 'red', 'purple', 'gold'];
console.log(fileLinks,'the links ');

  return (
    <div className="bg-slate-100 min-h-screen py-6">
      {contextHolder}
      <div className="container mx-auto px-4">
      <div className="text-sm text-gray-700 flex items-center mb-4 sm:mb-0">
          Showing{' '}
          <span className="font-medium ml-1">
            {(currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-medium ml-1">
            {Math.min(currentPage * pageSize, filteredCandidates.length)}
          </span>{' '}
          of{' '}
          <span className="font-medium ml-1">{filteredCandidates.length}</span>{' '}
          results
        </div>
        <Title level={2} className="text-gray-500 text-center mb-8 underline decoration-1">Candidates List</Title>

        <Row gutter={[16, 24]}>
          {status === 'loading' ? (
            [...Array(pageSize)].map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Skeleton active>
                  <CandidateCard loading />
                </Skeleton>
              </Col>
            ))
          ) : (
            candidatesForCurrentPage.map((candidate) => (
              <Col xs={24} sm={12} md={8} lg={6} key={candidate._id}>
                <CandidateCard
                  candidate={candidate}
                  fileLink={fileLinks[candidate._id]?.fileStreamUrl}
                  isFavorite={favoriteIds.includes(candidate._id)}
                  onToggleFavorite={handleLikeToggle}
                  tagColors={tagColors}
                />
              </Col>
            ))
          )}
        </Row>
      </div>
      <div className="mt-6">
        <Pagination totalItems={filteredCandidates.length} />
      </div>
    </div>
  );
}

export default React.memo(CandidateList);
