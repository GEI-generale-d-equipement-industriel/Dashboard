import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Typography, Row, Col, Tag, Divider, Skeleton, notification } from 'antd';
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";
import { fetchCandidates } from '../store/candidatesSlice';
import { toggleFavorite } from '../services/api/favoritesService';
import Pagination from './Pagination';

const { Meta } = Card;
const { Title } = Typography; 
const url = "http://localhost:3002";

function CandidateList() {
  const [notificationApi, contextHolder] = notification.useNotification();
  const favorites = useSelector((state) => state.favorites.favorites);
  const filteredCandidates = useSelector((state) => state.candidates.filteredCandidates);
  const status = useSelector((state) => state.candidates.status);
  const userId = useSelector((state) => state.auth.id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const handleLikeToggle = async (candidateId) => {
    try {
      // Call the toggleFavorite function
      await dispatch(toggleFavorite(userId, candidateId))
      
      // Show notification
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
        description: 'There was an error while updating favorites. Please try again.',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  const pageSize = useSelector((state) => state.candidates.pageSize);
  const currentPage = useSelector((state) => state.candidates.currentPage);

  const candidatesForCurrentPage = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCandidates.slice(startIndex, endIndex);
  }, [filteredCandidates, currentPage, pageSize]);

  // Ensure favorites is an array
  const favoriteIds = Array.isArray(favorites) ? favorites.map(fav => fav._id || fav) : [];
  const tagColors = [  'orange', 'red','purple',  'gold',];
  return (
    <div className="bg-slate-100 min-h-screen py-6">
      {contextHolder} {/* Place the notification container here */}
      <div className="container mx-auto px-4">
        <div className="text-sm text-gray-700 flex items-center mb-4 sm:mb-0">
          Showing <span className="font-medium ml-1">{(currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-medium ml-1">{Math.min(currentPage * pageSize, filteredCandidates.length)}</span> of{' '}
          <span className="font-medium ml-1">{filteredCandidates.length}</span> results
        </div>
        <Title level={2} className="text-gray-500 text-center mb-8 underline decoration-1">Candidates List</Title>

        <Row gutter={[16, 24]}>
          {status === 'loading' ? (
            [...Array(pageSize)].map((_, index) => (
              <Col span={12} md={8} lg={6} key={index}>
                <Skeleton active>
                  <Card loading={true} />
                </Skeleton>
              </Col>
            ))
          ) : (
            candidatesForCurrentPage.map((candidate) => (
              <Col span={12} md={8} lg={6} key={candidate._id}>
                <Card
                  cover={
                    <Link to={`/candidates/${candidate._id}`}>
                      <img
                        alt={`${candidate.name}`}
                        src={`${url}/files/download/${candidate?.files?.find(file => file?.contentType?.startsWith('image/'))?._id}`}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                  }
                  actions={[
                    <Button
                      key="toggle-favorite"
                      type="text"
                      icon={favoriteIds.includes(candidate._id) ? <IoIosRemoveCircleOutline /> : <IoIosAddCircleOutline />}
                      onClick={() => handleLikeToggle(candidate._id)}
                    >
                      {favoriteIds.includes(candidate._id) ? 'Remove From Favorites' : 'Add To Favorites'}
                    </Button>
                  ]}
                  className="shadow-lg rounded-lg"
                >
                  <Meta
                    title={<Link to={`/candidate/${candidate._id}`}>{candidate.firstName + " " + candidate.name}</Link>}
                    description={
                      <div>
                        {/* //{console.log(candidate.interest)
                          } */}
                        <Divider orientation="left"></Divider>
                        {candidate.interest.flatMap(interest => interest.split(',')).map((interest, index) => (
  <Tag color={tagColors[index % tagColors.length]} key={index}>
    {interest.trim()}
  </Tag>
))}
                      </div>
                    }
                  />
                  <div className="mt-2 flex justify-between">
                    <p className="text-sm font-medium text-gray-700 capitalize">{candidate.gender}</p>
                  </div>
                </Card>
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

export default CandidateList;
