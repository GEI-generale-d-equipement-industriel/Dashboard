import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../services/api/favoritesService";
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
  Form,
  Input,
  Select,
  Checkbox,
} from "antd";
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
  TikTokOutlined,
} from "@ant-design/icons";
import axios from "axios";
import BmiIndicateur from "./BmiIndicateur";
import useFetchFileLinks from "../Hooks/useFetchFileLinks";
const { Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;
const url = process.env.REACT_APP_API_BASE_URL|| '/api';

const interests = [
  "Modèle pour shooting en studio",
  "Créateur UGC",
  "Voix-off",
];
const sexes = ["Homme", "Femme"];
const facialHairOptions = ["Aucun", "Barbe", "Moustache", "Barbe et Moustache"];
const towns = [
  "Tunis",
  "Sfax",
  "Sousse",
  "Kairouan",
  "Gabès",
  "Bizerte",
  "Nabeul",
  "Monastir",
  "Mahdia",
  "Hammamet",
];
const eyeColors = ["Bleu", "Vert", "Marron", "Noir", "Noisette"];
const hairTypes = ["Lisses", "Ondulés", "Bouclés", "Crépus"];
const hairColors = ["Blond", "Brun", "Chatain", "Noir", "Roux", "Gris"];
const skinColors = ["Clair", "Pâle", "Moyen", "Olive", "Foncé", "Noir"];
const signs = ["Appareil dentaire", "Lunettes", "Tatouage"];

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorites.favorites);
  const userId = useSelector((state) => state.auth.id);
  const dispatch = useDispatch();
  const [candidate, setCandidate] = useState(null);
  const [fileLinks, setFileLinks] = useState([]);
  const [notificationApi, contextHolder] = notification.useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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
    if (typeof file === "string") {
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
        form.setFieldsValue(res.data);

        // Initialize an empty array for file links
        const candidateFileLinks = [];

        // Check if candidate has files
        if (res.data.files && res.data.files.length > 0) {
          for (const file of res.data.files) {
            const fileLink = file.filename || file.link || '';

            if (isValidGoogleDriveUrl(fileLink)) {
              // Fetch file from Google Drive
              try {
                const response = await axios.get(`${url}/google-drive/files`, {
                  params: { link: fileLink },
                });

                // Add the fetched files to the candidateFileLinks array
                candidateFileLinks.push(...response.data);
              } catch (error) {
                console.error(`Error fetching Google Drive files for candidate ${res.data._id}:`, error);
              }
            } else {
              // Fetch file from local server
              try {
                const fileMetadata = await axios.get(`${url}/files/download/${file._id}`, {
                  responseType: 'arraybuffer',
                });

                if (fileMetadata.data) {
                  const blob = new Blob([fileMetadata.data], { type: fileMetadata.headers['content-type'] });
                  const imageUrl = URL.createObjectURL(blob);

                  candidateFileLinks.push({
                    link: imageUrl,
                    filename: fileMetadata.data.filename,
                    contentType: fileMetadata.headers['content-type'],
                  });
                }
              } catch (error) {
                console.error(`Error fetching local file metadata for candidate ${res.data._id}:`, error);
              }
            }
          }
        }

        // Now you can use candidateFileLinks to display the file links
        setFileLinks(candidateFileLinks);

      } catch (error) {
        console.error(`Error fetching candidate ${id}:`, error);
      }
    };

    fetchCandidate();
  }, [id, form, url]);


  const candidateFileLinks = fileLinks; // Update this to directly use the state


  // Extracting image files based on content type
  const imageFiles = candidateFileLinks.filter(
    (file) => file.contentType && file.contentType.startsWith("image/")
  );


    
  const handleLikeToggle = async (candidateId) => {
    try {
      await dispatch(toggleFavorite(userId, candidateId));
      const isFavorite = favorites.some((c) => c._id === candidateId);

      notificationApi.info({
        message: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorite
          ? "This candidate has been removed from your favorites list."
          : "This candidate has been added to your favorites list.",
        placement: "topRight",
        duration: 2,
      });
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      notificationApi.error({
        message: "Action Failed",
        description:
          "There was an error while updating favorites. Please try again.",
        placement: "topRight",
        duration: 2,
      });
    }
  };

  const handleSave = async (values) => {
    
    const completeValues = {
      ...values,
      veiled: form.getFieldValue('veiled') || false,
      pregnant: form.getFieldValue('pregnant') || false,
    };
    
    
    try {
      const updatedCandidate = await axios.put(`${url}/candidates/${id}`, completeValues);
      
      notification.success({
        message: "Success",
        description: "Candidate details updated successfully.",
      });
      setIsEditing(false);
      setCandidate((prevCandidate) => ({
        ...prevCandidate,
        ...updatedCandidate.data, // Assuming the response contains the updated candidate
      }));
    const isFavorite = favorites.some(fav => fav._id === id);
        if (isFavorite) {
            dispatch(toggleFavorite(userId, id)); // This should ensure it's added back if it was removed due to reference change
        }
      form.setFieldsValue(completeValues);
    } catch (error) {
      console.error("Failed to update candidate:", error);
      notification.error({
        message: "Error",
        description: "Failed to update candidate details.",
      });
    }
  };

  const handleEditToggle = (event) => {
    event.preventDefault();
    setIsEditing((prev) => !prev);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.resetFields();
  };

  if (!candidate) {
    return <div className="text-center mt-8 text-xl">Loading...</div>;
  }

  // Ensure weight and height are numbers
  const weight = parseFloat(candidate.weight);
  const height = parseFloat(candidate.height);
  const bmi = weight / height ** 2;

  const isFavorite =
    Array.isArray(favorites) &&
    favorites.some((c) => c._id === candidate._id);

  const socialMediaLinks =
    candidate?.socialMedia?.map((link) => JSON.parse(link)) || [];

  

  const getFileIcon = (file) => {
    const contentType = file.contentType;
    if (!contentType) {
      return <FileUnknownOutlined />;
    }
    if (contentType === "application/pdf") {
      return <FilePdfOutlined style={{ color: "red" }} />;
    } else if (
      contentType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      contentType === "application/msword"
    ) {
      return <FileWordOutlined style={{ color: "blue" }} />;
    } else if (
      contentType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      contentType === "application/vnd.ms-excel"
    ) {
      return <FileExcelOutlined style={{ color: "green" }} />;
    } else if (contentType === "application/zip") {
      return <FileZipOutlined />;
    } else {
      return <FileOutlined />;
    }
  };

  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Content className="container mx-auto px-4 py-6">
        <Button
          type="link"
          onClick={() => navigate(-1)}
          className="text-2xl underline mb-4"
        >
          Back to Candidates
        </Button>
        <div
          className="shadow-lg rounded-lg p-6"
          style={{ backgroundColor: "#E5E5E5" }}
        >
          <Title level={2} className="text-center mb-6">
            {candidate.firstName} {candidate.name}
          </Title>
          <Divider />
          <Row gutter={16}>
            <Col xs={24} sm={12}>
           
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
                        style={{ cursor: "pointer" }}
                      >
                        
                        <img
                          src={file.fileStreamUrl||file.link}
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
                        src={imageFiles[currentSlide].fileStreamUrl||imageFiles[currentSlide].link}
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
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSave}
                  initialValues={candidate}
                >
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Details & Interests" key="1">
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Gender">
                              {isEditing ? (
                                <Form.Item name="gender" noStyle>
                                  <Select
                                    onChange={(value) =>
                                      form.setFieldsValue({ gender: value })
                                    }
                                  >
                                    {sexes.map((sex) => (
                                      <Select.Option key={sex} value={sex}>
                                        {sex}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              ) : (
                                <>
                                  {candidate.gender.toLowerCase() ===
                                  "femme" ? (
                                    <WomanOutlined
                                      style={{ color: "#eb2f96" }}
                                    />
                                  ) : (
                                    <ManOutlined style={{ color: "#1890ff" }} />
                                  )}
                                  {candidate.gender}
                                </>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Birth Year">
                              {isEditing ? (
                                <Form.Item name="birthYear" noStyle>
                                  <Input />
                                </Form.Item>
                              ) : (
                                <>
                                  <CalendarOutlined
                                    style={{ color: "#faad14" }}
                                  />
                                  {candidate.birthYear}
                                </>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Height">
                              {isEditing ? (
                                <Form.Item name="height" noStyle>
                                  <Input />
                                </Form.Item>
                              ) : (
                                <>
                                  <UserOutlined style={{ color: "#52c41a" }} />
                                  {candidate.height} m
                                </>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Weight">
                              {isEditing ? (
                                <Form.Item name="weight" noStyle>
                                  <Input />
                                </Form.Item>
                              ) : (
                                <>
                                  <UserOutlined style={{ color: "#722ed1" }} />
                                  {candidate.weight} kg
                                </>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Eye Color">
                              {isEditing ? (
                                <Form.Item name="eyeColor" noStyle>
                                  <Select
                                    placeholder="Select Eye Color"
                                    allowClear
                                    popupMatchSelectWidth={false}
                                    maxTagCount="responsive"
                                  >
                                    {eyeColors.map((color) => (
                                      <Select.Option key={color} value={color}>
                                        {color}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              ) : (
                                <>
                                  <EyeOutlined style={{ color: "#13c2c2" }} />
                                  {candidate.eyeColor}
                                </>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Hair Color">
                              {isEditing ? (
                                <Form.Item name="hairColor" noStyle>
                                  <Select
                                    placeholder="Select Hair Color"
                                    allowClear
                                    popupMatchSelectWidth={false}
                                    maxTagCount="responsive"
                                  >
                                    {hairColors.map((color) => (
                                      <Select.Option key={color} value={color}>
                                        {color}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              ) : (
                                <>
                                  <ScissorOutlined
                                    style={{ color: "#eb2f96" }}
                                  />
                                  {candidate.hairColor}
                                </>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Hair Type">
                              {isEditing ? (
                                <Form.Item name="hairType" noStyle>
                                  <Select
                                    placeholder="Select Hair Type"
                                    allowClear
                                    popupMatchSelectWidth={false}
                                    maxTagCount="responsive"
                                  >
                                    {hairTypes.map((type) => (
                                      <Select.Option key={type} value={type}>
                                        {type}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              ) : (
                                <>{candidate.hairType}</>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Skin Color">
                              {isEditing ? (
                                <Form.Item name="skinColor" noStyle>
                                  <Select
                                    placeholder="Select Skin Color"
                                    allowClear
                                    popupMatchSelectWidth={false}
                                    maxTagCount="responsive"
                                  >
                                    {skinColors.map((color) => (
                                      <Select.Option key={color} value={color}>
                                        {color}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              ) : (
                                <>{candidate.skinColor}</>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Signs">
                              {isEditing ? (
                                <Form.Item name="signs" noStyle>
                                  <Select
                                    mode="multiple"
                                    placeholder="Select Signs"
                                    popupMatchSelectWidth={false}
                                  >
                                    {signs.map((sign) => (
                                      <Select.Option key={sign} value={sign}>
                                        {sign}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              ) : (
                                <div className="mt-2">
                                  {candidate.signs &&
                                    candidate.signs
                                      .flatMap((sign) => sign.split(","))
                                      .map((sign, index) => (
                                        <Tag
                                          color="blue"
                                          key={index}
                                          style={{ cursor: "pointer" }}
                                        >
                                          {sign.trim()}
                                        </Tag>
                                      ))}
                                </div>
                              )}
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Descriptions bordered column={1} size="small" className="mb-4">
                            <Descriptions.Item label="Phone">
                              {isEditing ? (
                                <Form.Item name="phone" noStyle>
                                  <Input />
                                </Form.Item>
                              ) : (
                                <>
                                  <PhoneOutlined style={{ color: "#1890ff" }} />
                                  {candidate.phone}
                                </>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="BMI">
                            {isEditing ? (
                                <BmiIndicateur
                                  bmi={bmi}
                                  display={true}
                                  className="p-2 bg-blue-50 rounded-lg"
                                />
                              ) : (
                                <>
                                  <DashboardOutlined
                                    style={{ color: "#faad14" }}
                                  />
                                  <BmiIndicateur
                                    bmi={bmi}
                                    display={true}
                                    className="p-2 bg-blue-50 rounded-lg"
                                  />
                                </>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Interests">
                              {isEditing ? (
                                <Form.Item name="interest" noStyle>
                                  <Select mode="multiple">
                                    {interests.map((interest) => (
                                      <Select.Option
                                        key={interest}
                                        value={interest}
                                      >
                                        {interest}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              ) : (
                                <div className="mt-2">
                                  {candidate.interest &&
                                    candidate.interest
                                      .flatMap((interest) =>
                                        interest.split(",")
                                      )
                                      .map((interest, index) => (
                                        <Tag
                                          color="blue"
                                          key={index}
                                          style={{ cursor: "pointer" }}
                                        >
                                          {interest.trim()}
                                        </Tag>
                                      ))}
                                </div>
                              )}
                            </Descriptions.Item>
                            {form.getFieldValue("gender") === "Homme" && (
                              <Descriptions.Item label="Facial Hair">
                                {isEditing ? (
                                  <Form.Item name="facialHair" noStyle>
                                    <Select
                                      placeholder="Select Facial Hair"
                                      allowClear
                                      popupMatchSelectWidth={false}
                                      maxTagCount="responsive"
                                    >
                                      {facialHairOptions.map((option) => (
                                        <Select.Option
                                          key={option}
                                          value={option}
                                        >
                                          {option}
                                        </Select.Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                ) : (
                                  <div className="mt-2">
                                    {candidate.facialHair}
                                  </div>
                                )}
                              </Descriptions.Item>
                            )}
                            {form.getFieldValue("gender") === "Femme" && (
                              <>
                                {/* Editing Mode */}
                                {isEditing ? (
                                  <>
                                    <Form.Item
                                      label="Voilé"
                                      name="veiled"
                                      valuePropName="checked"
                                      initialValue={candidate.veiled || false}
                                    >
                                      <Checkbox
                                      onChange={(e) => {
                                        form.setFieldsValue({ veiled: e.target.checked });
                                        
                                      }}>Oui</Checkbox>
                                    </Form.Item>
                                    <Form.Item
                                      label="Enceinte"
                                      name="pregnant"
                                      valuePropName="checked"
                                      initialValue={candidate.pregnant || false}
                                      >
                                        <Checkbox
                                          onChange={(e) => {
                                            form.setFieldsValue({ pregnant: e.target.checked });
                                            
                                          }}
                                        >
                                        Oui</Checkbox>
                                    </Form.Item>
                                  </>
                                ) : (
                                  <>
                                    {/* Display Mode */}
                                    <Descriptions.Item label="Voilé">
                                      {candidate.veiled ? "Oui" : "Non"}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Enceinte">
                                      {candidate.pregnant ? "Oui" : "Non"}
                                    </Descriptions.Item>
                                  </>
                                )}
                              </>
                            )}
                            <Descriptions.Item label="Town">
                              {isEditing ? (
                                <Form.Item name="town" noStyle>
                                  <Select
                                    placeholder="Select a Town"
                                    allowClear
                                    popupMatchSelectWidth={false}
                                    maxTagCount="responsive"
                                  >
                                    {towns.map((town) => (
                                      <Select.Option key={town} value={town}>
                                        {town}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              ) : (
                                <div className="mt-2">{candidate.town}</div>
                              )}
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                      </Row>
                      <Form.Item className="text-center">
                        {isEditing ? (
                          <div className="flex justify-center space-x-4 mt-4">
                            <Button
                              type="primary"
                              htmlType="submit"
                              className="px-6 py-2"
                            >
                              Save
                            </Button>
                            <Button
                              type="default"
                              onClick={handleCancelEdit}
                              className="px-6 py-2"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-center mt-4">
                            <Button
                              type="primary"
                              onClick={handleEditToggle}
                              className="px-6 py-2"
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </Form.Item>
                    </TabPane>
                    <TabPane tab="Files & Social Media" key="2">
                      <div className="mt-2">
                        <Title level={4}>Files</Title>
                        <List
                          itemLayout="horizontal"
                          // dataSource={fileLinks.filter(
                          //   (file) =>
                          //     !file.contentType.startsWith("image/") &&
                          //     !file.contentType.startsWith("video/")
                          // )}
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
                              case "facebook":
                                return (
                                  <a
                                    key={index}
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FacebookOutlined
                                      style={{
                                        fontSize: "24px",
                                        color: "#3b5998",
                                      }}
                                    />
                                  </a>
                                );
                              case "tiktok":
                                return (
                                  <a
                                    key={index}
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <TikTokOutlined
                                      style={{
                                        fontSize: "24px",
                                        color: "#3b5998",
                                      }}
                                    />
                                  </a>
                                );
                              case "twitter":
                                return (
                                  <a
                                    key={index}
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <TwitterOutlined
                                      style={{
                                        fontSize: "24px",
                                        color: "#1DA1F2",
                                      }}
                                    />
                                  </a>
                                );
                              case "instagram":
                                return (
                                  <a
                                    key={index}
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <InstagramOutlined
                                      style={{
                                        fontSize: "24px",
                                        color: "#C13584",
                                      }}
                                    />
                                  </a>
                                );
                              case "linkedin":
                                return (
                                  <a
                                    key={index}
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <LinkedinOutlined
                                      style={{
                                        fontSize: "24px",
                                        color: "#0077B5",
                                      }}
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
                </Form>
                <div className="mt-4 flex justify-center">
                  <Button
                    type="primary"
                    icon={
                      isFavorite ? (
                        <HeartFilled style={{ color: "red" }} />
                      ) : (
                        <HeartOutlined />
                      )
                    }
                    onClick={() => handleLikeToggle(candidate._id)}
                  >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
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
