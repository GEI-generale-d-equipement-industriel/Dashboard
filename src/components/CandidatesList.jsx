import React, { useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Row, Col, Skeleton, notification } from 'antd';
import { fetchCandidates } from '../store/candidatesSlice';
import { toggleFavorite } from '../services/api/favoritesService';
import CandidateCard from './CandidateCard';
import useFetchFileLinks from '../Hooks/useFetchFileLinks';
import useInfiniteScroll from 'react-infinite-scroll-hook';

const { Title } = Typography;

function CandidateList() {
  const [notificationApi, contextHolder] = notification.useNotification();

  const favorites = useSelector((state) => state.favorites.favorites);
  const filteredCandidates = useSelector((state) => state.candidates.filteredCandidates);
  const status = useSelector((state) => state.candidates.status);
  const userId = useSelector((state) => state.auth.id);
  const dispatch = useDispatch();

  const pageSize = 10; // Define a fixed page size
  const [page, setPage] = React.useState(1);

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const candidatesForCurrentPage = useMemo(() => {
    const startIndex = 0;
    const endIndex = page * pageSize;
    return filteredCandidates.slice(startIndex, endIndex);
  }, [filteredCandidates, page, pageSize]);

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

  const [sentryRef] = useInfiniteScroll({
    loading: status === 'loading',
    hasNextPage: page * pageSize < filteredCandidates.length,
    onLoadMore: () => setPage((prevPage) => prevPage + 1),
    rootMargin: '0px 0px 400px 0px',
  });

  return (
    <div className="min-h-screen py-6" style={{ background: '#fcfcfc' }}>
      {contextHolder}
      <div className="container mx-auto px-4">
        <div className="text-sm text-gray-700 flex items-center mb-4 sm:mb-0">
          Showing{' '}
          <span className="font-medium ml-1">
            {1}
          </span>{' '}
          to{' '}
          <span className="font-medium ml-1">
            {Math.min(page * pageSize, filteredCandidates.length)}
          </span>{' '}
          of{' '}
          <span className="font-medium ml-1">{filteredCandidates.length}</span>{' '}
          results
        </div>
        <Title level={2} className="text-gray-500 text-center mb-8 underline decoration-1">Candidates List</Title>

        <Row gutter={[16, 24]}>
          {candidatesForCurrentPage.map((candidate) => (
            <Col xs={24} sm={12} md={8} lg={6} key={candidate._id}>
              <CandidateCard
                candidate={candidate}
                fileLink={fileLinks[candidate._id]?.fileStreamUrl}
                isFavorite={favoriteIds.includes(candidate._id)}
                onToggleFavorite={handleLikeToggle}
                tagColors={tagColors}
              />
            </Col>
          ))}
        </Row>
        {status === 'loading' && (
          <Row gutter={[16, 24]}>
            {[...Array(pageSize)].map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Skeleton active>
                  <CandidateCard loading />
                </Skeleton>
              </Col>
            ))}
          </Row>
        )}
        <div ref={sentryRef}>
          {status === 'loading' && <Skeleton active />}
        </div>
      </div>
    </div>
  );
}

export default React.memo(CandidateList);
