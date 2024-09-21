// CandidateDetails.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../services/api/favoritesService';
import useFetchFileLinks from "../Hooks/useFetchFileLinks"
import {
  Button,
  Card,
  Typography,
  Divider,
  Col,
  Row,
  Tag,
  notification,
  Layout,
  Tabs,
  Carousel,
  Modal,
  Descriptions,
  List,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  EyeOutlined,
  ScissorOutlined,
  HeartOutlined,
  HeartFilled,
  DashboardOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileZipOutlined,
  FileUnknownOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TikTokOutlined
} from '@ant-design/icons';
import axios from 'axios';
import BmiIndicateur from './BmiIndicateur';


const { Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;
const url = process.env.REACT_APP_API_BASE_URL; // Your backend API base URL

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorites.favorites);
  const userId = useSelector((state) => state.auth.id);
  const dispatch = useDispatch();
  const [candidate, setCandidate] = useState(null);
  const [fileLinks, setFileLinks] = useState([]);
  const [notificationApi, contextHolder] = notification.useNotification();

  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  console.log(candidate,'the candidate');
  
  const showModal = (index) => {
    setCurrentSlide(index);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const isValidGoogleDriveUrl = (url) => {
    const driveFileRegex =
      /^(https:\/\/)?(www\.)?(drive|docs)\.google\.com\/(?:file\/d\/|drive\/folders\/|open\?id=)[\w-]+/;
    return driveFileRegex.test(url);
  };

  const getFileLink = (file) => {
    if (typeof file === 'string') {
      return file;
    } else if (file.filename) {
      return file.filename;
    } else if (file.link) {
      return file.link;
    } else {
      return null;
    }
  };

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await axios.get(`${url}/candidates/${id}`);
        setCandidate(res.data);

        const candidateFiles = res.data.files;

        const candidateFileLinks = [];

        for (const file of candidateFiles) {
          const fileLink = getFileLink(file);

          if (fileLink && isValidGoogleDriveUrl(fileLink)) {
            try {
              const response = await axios.get(`${url}/google-drive/files`, {
                params: { link: fileLink },
              });

              candidateFileLinks.push(...response.data);
            } catch (error) {
              console.error(
                `Error fetching files for candidate ${res.data._id}:`,
                error
              );
            }
          }
        }

        setFileLinks(candidateFileLinks);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleLikeToggle = async (candidateId) => {
    try {
      await dispatch(toggleFavorite(userId, candidateId));
      const isFavorite = favorites.some((c) => c._id === candidateId);

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
        description:
          'There was an error while updating favorites. Please try again.',
        placement: 'topRight',
        duration: 2,
      });
    }
  };

  if (!candidate) {
    return <div className="text-center mt-8 text-xl">Loading...</div>;
  }
 

  // Ensure weight and height are numbers
  const weight = parseFloat(candidate.weight);
  const height = parseFloat(candidate.height);
  const bmi = weight / height ** 2;

  const tagColors = ['orange', 'red', 'purple', 'gold'];
  // Function to get the appropriate file icon
  const getFileIcon = (file) => {
    const contentType = file.contentType;
    if (!contentType) {
      return <FileUnknownOutlined />;
    }
    if (contentType === 'application/pdf') {
      return <FilePdfOutlined style={{ color: 'red' }} />;
    } else if (
      contentType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      contentType === 'application/msword'
    ) {
      return <FileWordOutlined style={{ color: 'blue' }} />;
    } else if (
      contentType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      contentType === 'application/vnd.ms-excel'
    ) {
      return <FileExcelOutlined style={{ color: 'green' }} />;
    } else if (contentType === 'application/zip') {
      return <FileZipOutlined />;
    } else {
      return <FileOutlined />;
    }
  };
  
  
  const isFavorite = Array.isArray(favorites) && favorites.some((c) => c?._id === candidate?._id);

  // Social media links (assuming they are part of candidate data)
  const socialMediaLinks = candidate?.socialMedia?.map(link => JSON.parse(link)) || [];
console.log(socialMediaLinks);

  // Filter out image files for the carousel
  const imageFiles = fileLinks.filter(
    (file) => file.contentType && file.contentType.startsWith('image/')
  );

  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Content className="container mx-auto px-4 py-6 ">
        <Button type="link" onClick={() => navigate(-1)} className='text-2xl underline mb-4'>
          Back to Candidates
        </Button>
        <div className="shadow-lg rounded-lg p-6" style={{ backgroundColor: "#E5E5E5" }}>
          {/* Candidate Name */}
          <Title level={2} className="text-center mb-6">
            {candidate.firstName} {candidate.name}
          </Title>
          <Divider />
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              {/* Carousel with modal */}
              {imageFiles.length > 0 ? (
                <>
                  <Carousel
                    arrows
                    afterChange={(current) => setCurrentSlide(current)}
                  >
                    {imageFiles.map((file, index) => (
                      <div
                        key={index}
                        onClick={() => showModal(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={file.fileStreamUrl}
                          alt={`Slide ${index}`}
                          className="w-full h-96 object-contain"
                        />
                      </div>
                    ))}
                  </Carousel>
                  <Modal
                    visible={visible}
                    footer={null}
                    onCancel={handleCancel}
                    width="40%"
                    centered
                  >
                    {imageFiles[currentSlide] && (
                      <img
                        src={imageFiles[currentSlide].fileStreamUrl}
                        alt={`Slide ${currentSlide}`}
                        className="w-full"
                      />
                    )}
                  </Modal>
                </>
              ) : (
                <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                  <p>No media available</p>
                </div>
              )}
            </Col>
            <Col xs={24} sm={12}>
              <Card className="bg-zinc-100">
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Details & Interests" key="1">
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Descriptions bordered column={1} size="small">
                          {/* Gender */}
                          <Descriptions.Item
                            label={
                              <>
                                {candidate.gender.toLowerCase() === 'female' ||
                                candidate.gender.toLowerCase() === 'femme' ? (
                                  <>
                                    <WomanOutlined style={{ color: '#eb2f96' }} /> Gender
                                  </>
                                ) : (
                                  <>
                                    <ManOutlined style={{ color: '#1890ff' }} /> Gender
                                  </>
                                )}
                              </>
                            }
                          >
                            {candidate.gender}
                          </Descriptions.Item>
                          {/* Birth Year */}
                          <Descriptions.Item
                            label={
                              <>
                                <CalendarOutlined style={{ color: '#faad14' }} /> Birth Year
                              </>
                            }
                          >
                            {candidate.birthYear}
                          </Descriptions.Item>
                          {/* Height */}
                          <Descriptions.Item
                            label={
                              <>
                                <UserOutlined style={{ color: '#52c41a' }} /> Height
                              </>
                            }
                          >
                            {candidate.height} m
                          </Descriptions.Item>
                          {/* Weight */}
                          <Descriptions.Item
                            label={
                              <>
                                <UserOutlined style={{ color: '#722ed1' }} /> Weight
                              </>
                            }
                          >
                            {candidate.weight} kg
                          </Descriptions.Item>
                          {/* Eye Color */}
                          <Descriptions.Item
                            label={
                              <>
                                <EyeOutlined style={{ color: '#13c2c2' }} /> Eye Color
                              </>
                            }
                          >
                            {candidate.eyeColor}
                          </Descriptions.Item>
                          {/* Hair Color */}
                          <Descriptions.Item
                            label={
                              <>
                                <ScissorOutlined style={{ color: '#eb2f96' }} /> Hair Color
                              </>
                            }
                          >
                            {candidate.hairColor}
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Descriptions bordered column={1} size="small">
                          {/* Phone */}
                          <Descriptions.Item
                            label={
                              <>
                                <PhoneOutlined style={{ color: '#1890ff' }} /> Phone
                              </>
                            }
                          >
                            {candidate.phone}
                          </Descriptions.Item>
                          {/* BMI */}
                          <Descriptions.Item
                            label={
                              <>
                                <DashboardOutlined style={{ color: '#faad14' }} /> IMC
                              </>
                            }
                          >
                            <BmiIndicateur bmi={bmi} display={true} />
                          </Descriptions.Item>
                          {/* Interests */}
                          <Descriptions.Item
                            label={<><UserOutlined /> Interests</>}
                          >
                            <div className="mt-2">
                              {candidate.interest &&
                                candidate.interest
                                  .flatMap((interest) => interest.split(','))
                                  .map((interest, index) => (
                                    <Tag
                                      color="blue"
                                      key={index}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {interest.trim()}
                                    </Tag>
                                  ))}
                            </div>
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="Files & Social Media" key="2">
                    <div className="mt-2">
                      <Title level={4}>Files</Title>
                      <List
                        itemLayout="horizontal"
                        dataSource={fileLinks.filter(
                          (file) =>
                            !file.contentType.startsWith('image/') &&
                            !file.contentType.startsWith('video/')
                        )}
                        renderItem={(file) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={getFileIcon(file)}
                              title={
                                <a
                                  href={file.fileStreamUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {file.name || file.filename}
                                </a>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                    <Divider />
                    <div className="mt-2">
                      <Title level={4}>Social Media</Title>
                      <div className="mt-2 flex space-x-4">
                        {socialMediaLinks.map((link, index) => {
                          switch (link.type.toLowerCase()) {
                            case 'facebook':
                              return (
                                <a
                                  key={index}
                                  href={link.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FacebookOutlined
                                    style={{ fontSize: '24px', color: '#3b5998' }}
                                  />
                                </a>
                              );
                            case 'tiktok':
                              return (
                                <a
                                  key={index}
                                  href={link.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <TikTokOutlined
                                    style={{ fontSize: '24px', color: '#3b5998' }}
                                  />
                                </a>
                              );
                            case 'twitter':
                              return (
                                <a
                                  key={index}
                                  href={link.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <TwitterOutlined
                                    style={{ fontSize: '24px', color: '#1DA1F2' }}
                                  />
                                </a>
                              );
                            case 'instagram':
                              return (
                                <a
                                  key={index}
                                  href={link.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <InstagramOutlined
                                    style={{ fontSize: '24px', color: '#C13584' }}
                                  />
                                </a>
                              );
                            case 'linkedin':
                              return (
                                <a
                                  key={index}
                                  href={link.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <LinkedinOutlined
                                    style={{ fontSize: '24px', color: '#0077B5' }}
                                  />
                                </a>
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>
                    </div>
                  </TabPane>
                </Tabs>
                {/* Favorite Button Below Information */}
                <div className="mt-4 flex justify-center">
                  <Button
                    type="primary"
                    icon={
                      isFavorite ? (
                        <HeartFilled style={{ color: 'red' }} />
                      ) : (
                        <HeartOutlined />
                      )
                    }
                    onClick={() => handleLikeToggle(candidate._id)}
                  >
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default CandidateDetails;
