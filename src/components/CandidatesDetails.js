import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../services/api/favoritesService'; // Update this import if necessary
import { TikTokOutlined, InstagramOutlined, FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from 'react-icons/io';
import Slider from 'react-slick';
import { Button, Card, Typography, Divider, Col, Row, Tag, notification } from 'antd';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BmiIndicateur from './BmiIndicateur';
import axios from 'axios';
import AuthInterceptor from '../services/auth/AuthInterceptor';

const { Meta } = Card;
const { Title, Text } = Typography;
const url = "http://localhost:3002";

const CandidateDetails = () => {
  const { id } = useParams();
  const candidates = useSelector((state) => state.candidates.candidates);
  const favorites = useSelector((state) => state.favorites.favorites);
  const userId = useSelector((state) => state.auth.id);
  const dispatch = useDispatch();
  const api = AuthInterceptor.getInstance();
  const [candidate, setCandidate] = useState(null);
  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    const selectCandidate = async () => {
      try {
        const res = await api.get(`/candidates/${id}`);
        setCandidate(res);
      } catch (error) {
        console.error(error);
      }
    };
    selectCandidate();
  }, [id]);

  const handleLikeToggle = async (candidateId) => {
    try {
      await dispatch(toggleFavorite(userId, candidateId)).unwrap();
      const isFavorite = favorites.some(c => c._id === candidateId);

      notificationApi.info({
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

  if (!candidate) {
    return <div className="text-center mt-8 text-xl">Loading...</div>;
  }

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const iconMap = {
    Google: <GoogleOutlined />,
    Instagram: <InstagramOutlined />,
    TikTok: <TikTokOutlined />,
    Facebook: <FacebookOutlined />,
  };

  const images = candidate.files.filter(file => file.contentType.startsWith('image/'));
  const videoFiles = candidate.files.filter(file => file.contentType === 'video/mp4');
  const audioFiles = candidate.files.filter(file => file.contentType === 'audio/wav');

  let socialMedia = candidate?.socialMedia || [];
  socialMedia = socialMedia.map(sm => typeof sm === 'string' ? JSON.parse(sm) : sm);

  const renderFileLinks = (file) => {
    if (file.filename.includes("drive.google.com")) {
      return (
        <a key={file._id} href={file.filename} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-500 hover:underline">
          <GoogleOutlined />
          <span>Google Drive Folder</span>
        </a>
      );
    }

    if (file.filename.includes("tiktok.com")) {
      return (
        <a key={file._id} href={file.filename} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-500 hover:underline">
          <TikTokOutlined />
          <span>TikTok Profile</span>
        </a>
      );
    }

    if (file.filename.includes("facebook.com")) {
      return (
        <a key={file._id} href={file.filename} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-500 hover:underline">
          <FacebookOutlined />
          <span>Facebook Profile</span>
        </a>
      );
    }

    if (file.filename.includes("instagram.com")) {
      return (
        <a key={file._id} href={file.filename} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-500 hover:underline">
          <InstagramOutlined />
          <span>Instagram Profile</span>
        </a>
      );
    }

    return (
      <a key={file._id} href={`${url}/files/download/${file._id}`} download className="text-blue-500 hover:underline">
        {file.filename} (Download)
      </a>
    );
  };
  const tagColors = ['blue', 'green', 'orange', 'purple', 'red', 'gold'];
  return (
    <div className="container mx-auto px-4 py-6">
      {contextHolder} {/* Place the notification container here */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <Title level={2} className="text-center mb-6 border-b-2 border-gray-300 pb-3">{candidate.name} {candidate.firstName}</Title>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              {images.length > 1 ? (
                <Slider {...settings}>
                  {images.map((file) => (
                    <div key={file._id} className="w-full flex items-center justify-center">
                      <img
                        src={`${url}/files/download/${file._id}`}
                        alt={`${candidate.name} ${candidate.firstName}`}
                        className="object-contain"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                images.length === 1 && (
                  <div className="w-full flex items-center justify-center">
                    <img
                      src={`${url}/files/download/${images[0]._id}`}
                      alt={`${candidate.name} ${candidate.firstName}`}
                      className="object-contain"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                )
              )}
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <Card
              className="bg-gray-100"
              actions={[
                <Button
                  key="toggle-favorite"
                  type="primary"
                  icon={favorites.some(c => c._id === candidate._id) ? <IoIosRemoveCircleOutline /> : <IoIosAddCircleOutline />}
                  onClick={() => handleLikeToggle(candidate._id)}
                >
                  {favorites.some(c => c._id === candidate._id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              ]}
            >
              <Meta
                description={
                  <div>
                    <Divider orientation="left">Information</Divider>
                    <Text strong>Gender:</Text> {candidate.gender}<br />
                    <Text strong>Birth Year:</Text> {candidate.birthYear}<br />
                    <Text strong>Height:</Text> {candidate.height} m<br />
                    <Text strong>Weight:</Text> {candidate.weight} kg<br />
                    <Text strong>Eye Color:</Text> {candidate.eyeColor}<br />
                    <Text strong>Hair Color:</Text> {candidate.hairColor}<br />
                    <Text strong>Phone:</Text> {candidate.phone}<br />
                    <Text strong>IMC:</Text> {`${(candidate.weight / (candidate.height ** 2)).toFixed(2)}`}<br />
                    <BmiIndicateur bmi={(candidate.weight / (candidate.height ** 2)).toFixed(2)} />
                    <Text strong>Interests:</Text> 
                    <div className="mt-2">
                    {candidate.interest.flatMap(interest => interest.split(',')).map((interest, index) => (
  <Tag color={tagColors[index % tagColors.length]} key={index} className="mr-1 mb-1">
    {interest.trim()}
  </Tag>
))}
                    </div>
                    {socialMedia.length > 0 && <Divider orientation="left">Social Media</Divider>}
                    <div className="mt-2">
                      {socialMedia.map((sm, index) => (
                        <Tag 
                          color="cyan" 
                          key={index} 
                          className={`mr-1 mb-1 ${!sm.link ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`} 
                          icon={iconMap[sm.type]}
                        >
                          <a
                            href={sm.link || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`ml-2 ${!sm.link ? 'pointer-events-none' : ''}`}
                            onClick={e => !sm.link && e.preventDefault()}
                          >
                            {sm.type}
                          </a>
                        </Tag>
                      ))}
                    </div>
                    {(videoFiles.length > 0 || audioFiles.length > 0) && <Divider orientation="left">Files</Divider>}
                    <div className="mt-2">
                      {candidate.files.map(renderFileLinks)}
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CandidateDetails;
