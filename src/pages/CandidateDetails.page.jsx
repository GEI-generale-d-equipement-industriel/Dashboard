import React, { useEffect, useState } from 'react';
import { Layout, Skeleton, Card, Row, Col, notification,Form } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import isEqual from 'lodash/isEqual';

import CandidateHeader from '../components/Headers/CandidateHeader';
import CandidateImageGallery from '../components/ImageGallery/CandidateImageGallery';
import CandidateDetailsCard from '../components/Cards/CandidateDetailsCard';

import { useUpdateFavorites, useFetchFavorites } from '../services/api/favoritesService';

const { Content } = Layout;

const CandidateDetails = () => {
  const { id } = useParams();
  const userId = useSelector((state) => state.auth.id);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [isFavorite, setIsFavorite] = useState(false);

  const url = process.env.REACT_APP_API_BASE_URL || '/api';

  // Fetch candidate data
  const {
    data: candidate,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      const res = await axios.get(`${url}/candidates/${id}`);

      return res.data;
    },
    enabled: !!id,
  });

  // Fetch favorites
  const { data: favorites = [] } = useFetchFavorites(userId);
  const { mutate: updateFavorite } = useUpdateFavorites();

  // Extract image files
  const imageFiles =
    candidate?.files?.filter(
      (file) => file.contentType && file.contentType.startsWith('image/')
    ) || [];

  // Update favorite status
  useEffect(() => {
    if (candidate && favorites) {
      setIsFavorite(favorites.some((fav) => fav._id === candidate._id));
    }
  }, [candidate, favorites]);

  const handleLikeToggle = () => {
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    const currentFavorites = queryClient.getQueryData(['favorites', userId]) || [];

    const isCurrentlyFavorite = currentFavorites.some((fav) => fav._id === candidate._id);
    const updatedFavorites = isCurrentlyFavorite
      ? currentFavorites.filter((fav) => fav._id !== candidate._id)
      : [...currentFavorites, candidate];

    setIsFavorite(!isCurrentlyFavorite);

    updateFavorite(
      { userId, favorites: updatedFavorites },
      {
        onSuccess: () => {
          notification.success({
            message: isCurrentlyFavorite ? 'Removed from Favorites' : 'Added to Favorites',
            placement: 'topRight',
            duration: 2,
          });
          queryClient.invalidateQueries(['favorites', userId]);
        },
        onError: () => {
          setIsFavorite(isCurrentlyFavorite);
          notification.error({
            message: 'Error',
            description: 'Failed to update favorites.',
          });
        },
      }
    );
  };

  const handleSave = async (values) => {
    const currentValues = form.getFieldsValue();
    const initialValues = form.getFieldsValue(true);

    if (isEqual(currentValues, initialValues)) {
      notification.warning({
        message: 'No Changes',
        description: 'No changes detected to save.',
      });
      return;
    }

    try {
      await axios.put(`${url}/candidates/${id}`, values);
      notification.success({
        message: 'Success',
        description: 'Candidate details updated successfully.',
      });
      setIsEditing(false);
      queryClient.invalidateQueries(['candidate', id]);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update candidate details.',
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="text-center mt-8">
        <Skeleton active />
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="text-center mt-8 text-red-500">
        <p>Error loading candidate details. Please try again later.</p>
      </div>
    );
  }

  const weight = parseFloat(candidate.weight);
  const height = parseFloat(candidate.height);
  const bmi = weight / height ** 2;

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="max-w-6xl mx-auto p-4 sm:p-6">
        <CandidateHeader
          candidateName={`${candidate.firstName} ${candidate.name}`}
        />
         <Row gutter={[24, 24]} justify="center">
          {/* Left Column: Image Gallery */}
          <Col xs={24} lg={12}>
            <div className="w-full h-full flex justify-center">
              <CandidateImageGallery imageFiles={imageFiles} />
            </div>
          </Col>
          <Col xs={24}  lg={12}>
            <CandidateDetailsCard
              candidate={candidate}
              isEditing={isEditing}
              form={form}
              handleSave={handleSave}
              handleEditToggle={handleEditToggle}
              isFavorite={isFavorite}
              handleLikeToggle={handleLikeToggle}
              bmi={bmi}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default CandidateDetails;
