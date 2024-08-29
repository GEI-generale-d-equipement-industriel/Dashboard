import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../store/movieSlice';
import { LikeOutlined, DislikeOutlined,TikTokOutlined,InstagramOutlined  } from '@ant-design/icons';
import { IoIosAddCircleOutline,IoIosRemoveCircleOutline } from "react-icons/io";

import Slider from 'react-slick';
import { Button, Card, Typography, Divider, Col, Row,Tag } from 'antd';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const { Meta } = Card;
const { Title, Text } = Typography;

const CandidateDetails = () => {
  const { id } = useParams();
  const candidates = useSelector((state) => state.candidates.candidates);
  const favorites = useSelector((state) => state.candidates.favorites);
  const dispatch = useDispatch();

  const [candidate, setCandidate] = useState(null);

  const handleLikeToggle = (candidateId) => {
    dispatch(toggleFavorite(candidateId));
  };

  useEffect(() => {
    const selectedCandidate = candidates.find((c) => c._id === id);
    if (selectedCandidate) {
      setCandidate(selectedCandidate);
    }
  }, [id, candidates]);

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
    TikTok: <TikTokOutlined />, // Replace with TikTok icon
    Instagram: <InstagramOutlined />,
    // Add more mappings here if needed
  };
  const images = candidate.files.filter(file => file.contentType.startsWith('image/'));
  const videoFiles = candidate.files.filter(file => file.contentType === 'video/mp4');
  const audioFiles = candidate.files.filter(file => file.contentType === 'audio/wav');
  let socialMedia = candidate?.socialMedia;
  console.log(socialMedia);
  
  if (socialMedia) {
    try {
      socialMedia = socialMedia.map(sm => {
        
        if (typeof sm === 'string') {
          console.log(JSON.parse(sm),'the sm');
          return JSON.parse(sm);
        }
        
        
        return sm;
      });
    } catch (error) {
      console.error("Error parsing social media data: ", error);
      socialMedia = []; // Fallback to an empty array if parsing fails
    }
  } else {
    socialMedia = []; // Fallback if it's not an array
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <Title level={2} className="text-center mb-6">{candidate.name} {candidate.firstName}</Title>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              {images.length > 1 ? (
                <Slider {...settings}>
                  {images.map((file) => (
                    <div key={file._id} className="w-full flex items-center justify-center">
                      <img
                        src={`http://192.168.1.114:5000/api/files/${file._id}`}
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
                      src={`http://192.168.1.114:5000/api/files/${images[0]._id}`}
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
              // title="Details"
              className="bg-gray-100"
              actions={[
                <Button
                  key="toggle-favorite"
                  type="primary"
                  icon={favorites.includes(candidate._id) ?  <IoIosRemoveCircleOutline /> : <IoIosAddCircleOutline />}
                  onClick={() => handleLikeToggle(candidate._id)}
                  className={`w-full ${favorites.includes(candidate._id) ? 'bg-red-500' : 'bg-green-500'}`}
                >
                  {favorites.includes(candidate._id) ? 'Remove from Favorites' : 'Add to Favorites'}
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
                    <Text strong>Interests:</Text> 
    <div>
      {candidate.interest.split(',').map((interest, index) => (
        <Tag color="blue" key={index}>
          {interest.trim()}
        </Tag>
      ))}
    </div>
    {socialMedia.length>0 &&<Divider orientation="left">Social Media</Divider>}
                    <div>
                      {socialMedia && socialMedia.length > 0 && socialMedia.map((sm, index) => (
                        <Tag color="cyan" key={index} className="" icon={iconMap[sm.type]}>
                        
                        <a href={sm.link} target="_blank" rel="noopener noreferrer" className="ml-2">
                          {sm.type}
                        </a>
                      </Tag>
                      ))}
                    </div>
                    {videoFiles.length > 0||audioFiles.length > 0 && <Divider orientation="left">Files</Divider>}
                    <div>
                      {videoFiles.length > 0 && (
                        <div>
                          <Title level={4}>Video Files</Title>
                          {videoFiles.map((file) => (
                            <a key={file._id} href={`http://192.168.1.114:5000/api/files/${file._id}`} download>
                              {file.filename} (Video)
                            </a>
                          ))}
                        </div>
                      )}
                      {audioFiles.length > 0 && (
                        <div className="mt-4">
                          <Title level={4}>Audio Files</Title>
                          {audioFiles.map((file) => (
                            <a key={file._id} href={`http://192.168.1.114:5000/api/files/${file._id}`} download>
                              {file.filename} (Audio)
                            </a>
                          ))}
                        </div>
                      )}
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
