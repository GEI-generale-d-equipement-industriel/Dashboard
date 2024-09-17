import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../services/api/favoritesService';
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from 'react-icons/io';
import { Button, Card, Typography, Divider, Col, Row, Tag, notification } from 'antd';
import axios from 'axios';
import BmiIndicateur from './BmiIndicateur';
import CandidateFileSlider from './CandidateSlider'; // Import the new slider component

const { Meta } = Card;
const { Title, Text } = Typography;
const url = "http://localhost:3002"; // Your backend API base URL

const CandidateDetails = () => {
  const { id } = useParams();
  const favorites = useSelector((state) => state.favorites.favorites);
  const userId = useSelector((state) => state.auth.id);
  const dispatch = useDispatch();
  const [candidate, setCandidate] = useState(null);
  const [fileLinks, setFileLinks] = useState([]);
  const [notificationApi, contextHolder] = notification.useNotification();


  const isValidGoogleDriveUrl = (url) => {
    const driveFileRegex = /^(https:\/\/)?(www\.)?(drive|docs)\.google\.com\/(?:file\/d\/|drive\/folders\/|open\?id=)[\w-]+/;
    return driveFileRegex.test(url);
  };
  
  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await axios.get(`${url}/candidates/${id}`);
        setCandidate(res.data);
  
        const validFiles = res.data.files.filter(file => isValidGoogleDriveUrl(file.filename));
  
        if (validFiles.length > 0) {
          const fileLinksResponses = await Promise.all(
            validFiles.map(file => axios.get(`${url}/google-drive/files`, {
              params: { link: file.filename },
            }))
          );
  
          const allFileLinks = fileLinksResponses.flatMap(response => response.data);
          setFileLinks(allFileLinks);
        } else {
          setFileLinks([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchCandidate();
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

  return (
    <div className="container mx-auto px-4 py-6">
      {contextHolder}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <Title level={2} className="text-center mb-6 border-b-2 border-gray-300 pb-3">
          {candidate.name} {candidate.firstName}
        </Title>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            {/* Use the CandidateFileSlider component for rendering images/videos */}
            <CandidateFileSlider 
  files={fileLinks.filter(file => file.contentType.startsWith('image/') || file.contentType.startsWith('video/'))}
  className="w-full h-80 object-cover" // Tailwind classes for smaller height
/>          </Col>
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
                        <Tag color="blue" key={index}>{interest.trim()}</Tag>
                      ))}
                    </div>
                    <Divider orientation="left">Files</Divider>
                    <div className="mt-2">
                    {fileLinks.filter(file => !file.contentType.startsWith('image/') && !file.contentType.startsWith('video/')).map((file) => (
  <a key={file.fileId || file.filename} href={file.fileStreamUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
    {file.filename}
  </a>
))}
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
