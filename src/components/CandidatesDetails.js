import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../store/candidatesSlice';
import { TikTokOutlined, InstagramOutlined, FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from 'react-icons/io';
import Slider from 'react-slick';
import { Button, Card, Typography, Divider, Col, Row, Tag } from 'antd';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BmiIndicateur from './BmiIndicateur';
import axios from 'axios';
const url = "http://localhost:3002";

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
  const selectCandidate=async()=>{
   try{const res=await axios.get(`${url}/candidates/${id}`)
  
    setCandidate(res.data)
  }catch(error){
    console.error(error)
  }
   
   

  }
  useEffect(() => {
    selectCandidate()
    
  }, [id]);

  if (!candidate) {
    return <div className="text-center mt-8 text-xl">Loading...</div>;
  }
// console.log(candidate);

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

  let socialMedia = candidate?.socialMedia;
  if (socialMedia) {
    try {
      socialMedia = socialMedia.map(sm => {
        if (typeof sm === 'string') {
          return JSON.parse(sm);
        }
        return sm;
      });
    } catch (error) {
      console.error("Error parsing social media data: ", error);
      socialMedia = [];
    }
  } else {
    socialMedia = [];
  }

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

  return (
    <div className="container mx-auto px-4 py-6">
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
                  icon={favorites.includes(candidate._id) ? <IoIosRemoveCircleOutline /> : <IoIosAddCircleOutline />}
                  onClick={() => handleLikeToggle(candidate._id)}
                  className={`w-full ${favorites.includes(candidate._id) ? 'bg-red-500' : 'bg-green-500'} text-white`}
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
                    <Text strong>IMC:</Text> {`${(candidate.weight / (candidate.height ** 2)).toFixed(2)}`}<br />
                    <BmiIndicateur bmi={(candidate.weight / (candidate.height ** 2)).toFixed(2)} />
                    <Text strong>Interests:</Text> 
                    <div className="mt-2">
                      {candidate.interest.split(',').map((interest, index) => (
                        <Tag color="blue" key={index} className="mr-1 mb-1">
                          {interest.trim()}
                        </Tag>
                      ))}
                    </div>
                    {socialMedia.length > 0 && <Divider orientation="left">Social Media</Divider>}
                    <div className="mt-2">
                      
                      {socialMedia &&  socialMedia.map((sm, index) => (
                         <Tag 
                         color="cyan" 
                         key={index} 
                         className={`mr-1 mb-1 ${!sm.link ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`} // Apply Tailwind classes conditionally
                         icon={iconMap[sm.type]}
                       >
                         <a
                           href={sm.link || '#'}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={`ml-2 ${!sm.link ? 'pointer-events-none' : ''}`} // Disable pointer events if no link
                           onClick={e => !sm.link && e.preventDefault()} // Prevent clicking when no link
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
