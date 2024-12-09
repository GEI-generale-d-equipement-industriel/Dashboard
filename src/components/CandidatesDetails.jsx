import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
  Descriptions,
  List,
  Form,
  Input,
  Select,
  Checkbox,
  Skeleton,
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
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TikTokOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import BmiIndicateur from "./BmiIndicateur";
import {
  useUpdateFavorites,
  useFetchFavorites,
} from "../services/api/favoritesService";
import isEqual from "lodash/isEqual";
import ImageGallery from "./ImageGallery/ImagesGallery";
const { Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;
const url = process.env.REACT_APP_API_BASE_URL || "/api";

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
  const userId = useSelector((state) => state.auth.id);
  const navigate = useNavigate();
  const [notificationApi, contextHolder] = notification.useNotification();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const [isFavorite, setIsFavorite] = useState(false);

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

  // const fileLinks = useFetchFileLinks(candidate ? [candidate] : []);

  const { data: favorites = [] } = useFetchFavorites(userId);
  const { mutate: updateFavorite } = useUpdateFavorites();

  // Extracting image files based on content type
  const imageFiles =
    candidate?.files?.filter(
      (file) => file.contentType && file.contentType.startsWith("image/")
    ) || [];

  useEffect(() => {
    const favorites = queryClient.getQueryData(["favorites", userId]) || [];
    const favoriteStatus = favorites.some((fav) => fav._id === candidate?._id);
    setIsFavorite(favoriteStatus); // Set the initial favorite status based on cached favorites
  }, [candidate, userId, queryClient]);

  useEffect(() => {
    if (candidate && favorites) {
      setIsFavorite(favorites.some((fav) => fav._id === candidate._id));
    }
  }, [candidate, favorites]);

  const handleLikeToggle = () => {
    // Get the userId from state or context
    // const userId = useSelector((state) => state.auth.id);

    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    // Log userId and candidate id for debugging

    const favorites = queryClient.getQueryData(["favorites", userId]) || [];

    // Ensure it's an array
    if (!Array.isArray(favorites)) {
      console.error("Favorites data is not an array");
      return;
    }

    // const isFavorite = favorites.some(fav => fav._id === candidate._id);
    const isCurrentlyFavorite = favorites.some(
      (fav) => fav._id === candidate._id
    );
    const updatedFavorites = isCurrentlyFavorite
      ? favorites.filter((fav) => fav._id !== candidate._id) // Remove from favorites
      : [...favorites, candidate]; // Add to favorites

    setIsFavorite(!isCurrentlyFavorite);

    updateFavorite(
      { userId, favorites: updatedFavorites },
      {
        onSuccess: () => {
          notification.success({
            message: isCurrentlyFavorite
              ? "Removed from Favorites"
              : "Added to Favorites",
            placement: "topRight",
            duration: 2,
          });
          queryClient.invalidateQueries(["favorites", userId]); // Refetch favorites after updating
        },
        onError: () => {
          setIsFavorite(isCurrentlyFavorite);
          notification.error({
            message: "Error",
            description: "Failed to update favorites.",
          });
        },
      }
    );
  };

  const handleSave = async (values) => {
    const currentValues = form.getFieldsValue();
    const initialValues = form.getFieldsValue(true);

    // Check if form values have changed
    if (isEqual(currentValues, initialValues)) {
      notification.warning({
        message: "No Changes",
        description: "No changes detected to save.",
      });
      return;
    }

    try {
      const updatedCandidate = await axios.put(
        `${url}/candidates/${id}`,
        values
      );
      notification.success({
        message: "Success",
        description: "Candidate details updated successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries(["candidate", id]);
    } catch (error) {
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

  // if (!candidate) {
  //   return <div className="text-center mt-8 text-xl">Loading...</div>;
  // }
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
  // const isFavorite = queryClient.getQueryData("favorites")?.some(
  //   (fav) => fav._id === candidate._id
  // );
  // Ensure weight and height are numbers
  const weight = parseFloat(candidate.weight);
  const height = parseFloat(candidate.height);
  const bmi = weight / height ** 2;

  // const isFavorite =
  //   Array.isArray(favorites) &&
  //   favorites.some((c) => c._id === candidate._id);

  const socialMediaLinks =
    candidate?.socialMedia?.map((link) => JSON.parse(link)) || [];

  return (
    <Layout className="min-h-screen bg-gray-50">
      {contextHolder}
      <Content className="max-w-6xl mx-auto p-4 sm:p-6">
        <Button
          type="text"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 mb-4 text-lg text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeftOutlined />
          <span>Back to Candidates</span>
        </Button>
        {/* <div
          className="shadow-lg rounded-lg p-6"
          style={{ backgroundColor: "#E5E5E5" }}
        > */}
        <Card className="shadow-lg rounded-lg bg-white p-6">
          <Title level={3} className="text-center text-gray-800 mb-4">
            {candidate.firstName} {candidate.name}
          </Title>
          <Divider />
          <Row gutter={[16, 16]} className="flex-wrap">
            <Col xs={24} sm={24} md={12} lg={12} className="flex justify-center">
              
                <ImageGallery
                  images={imageFiles} // Array of image objects
                  containerStyle={{ maxWidth: "600px", margin: "0 auto" ,padding: "16px",}}
                  thumbnailSize={60} // Thumbnail size in pixels
                  mainImageHeight={400} // Fixed height for the main image
                  // Optional callback
                />
              
            </Col>

            <Col xs={24} sm={24} md={12} lg={12}>
              <Card className="bg-gray-100 shadow-md p-6 rounded-lg">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSave}
                  initialValues={candidate}
                >
                  <Tabs defaultActiveKey="1" className="custom-tabs"
                tabBarStyle={{
                  borderBottom: "2px solid #E5E7EB",
                  marginBottom: "1rem",
                }}>
                    <TabPane tab="Details & Interests" key="1">
                      <Row gutter={[16, 16]}>
                        <Col span={24}>
                          <Descriptions
                            bordered
                            column={{ xs: 1, sm: 1, md: 2 }}
                            size="small"
                            className="mb-4 bg-white rounded-lg shadow-md"
                          >
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
                                <div className="flex items-center">
                                  {candidate.gender.toLowerCase() ===
                                  "femme" ? (
                                    <WomanOutlined className="text-pink-500 mr-2 text-lg" />
                                  ) : (
                                    <ManOutlined className="text-blue-500 mr-2 text-lg" />
                                  )}
                                  <span className="text-gray-700">
                                    {candidate.gender}
                                  </span>
                                </div>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Birth Year">
                              {isEditing ? (
                                <Form.Item name="birthYear" noStyle>
                                  <Input className="w-full" />
                                </Form.Item>
                              ) : (
                                <div className="flex items-center">
                                  <CalendarOutlined className="text-yellow-500 mr-2 text-lg" />
                                  <span className="text-gray-700">
                                    {candidate.birthYear}
                                  </span>
                                </div>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Height">
                              {isEditing ? (
                                <Form.Item name="height" noStyle>
                                  <Input className="w-full" />
                                </Form.Item>
                              ) : (
                                <div className="flex items-center">
                                  <UserOutlined className="text-green-500 mr-2 text-lg" />
                                  <span className="text-gray-700">
                                    {candidate.height} m
                                  </span>
                                </div>
                              )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Weight">
                              {isEditing ? (
                                <Form.Item name="weight" noStyle>
                                  <Input className="w-full" />
                                </Form.Item>
                              ) : (
                                <div className="flex items-center">
                                  <UserOutlined className="text-purple-500 mr-2 text-lg" />
                                  <span className="text-gray-700">
                                    {candidate.weight} kg
                                  </span>
                                </div>
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
                                <div className="flex items-center">
                                  <EyeOutlined className="text-teal-500 mr-2 text-lg" />
                                  <span className="text-gray-700">
                                    {candidate.eyeColor}
                                  </span>
                                </div>
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
                                <div className="flex items-center">
                                  <ScissorOutlined className="text-pink-500 mr-2 text-lg" />
                                  <span className="text-gray-700">
                                    {candidate.hairColor}
                                  </span>
                                </div>
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
                                <span className="text-gray-700">
                                  {candidate.hairType}
                                </span>
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
                                <span className="text-gray-700">
                                  {candidate.skinColor}
                                </span>
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
                                          className="text-sm cursor-pointer"
                                        >
                                          {sign.trim()}
                                        </Tag>
                                      ))}
                                </div>
                              )}
                            </Descriptions.Item>
                          </Descriptions>

                          <Col xs={24} sm={12}>
                            <Descriptions
                              bordered
                              column={1}
                              size="small"
                              className="mb-4 bg-white rounded-lg shadow-md p-4"
                            >
                              <Descriptions.Item label="Phone">
                                {isEditing ? (
                                  <Form.Item name="phone" noStyle>
                                    <Input
                                      className="w-full"
                                      placeholder="Enter phone number"
                                    />
                                  </Form.Item>
                                ) : (
                                  <div className="flex items-center">
                                    <PhoneOutlined className="text-blue-500 mr-2 text-lg" />
                                    <span className="text-gray-700">
                                      {candidate.phone}
                                    </span>
                                  </div>
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
                                  <div className="flex items-center">
                                    <DashboardOutlined className="text-yellow-500 mr-2 text-lg" />
                                    <BmiIndicateur
                                      bmi={bmi}
                                      display={true}
                                      className="p-2 bg-blue-50 rounded-lg"
                                    />
                                  </div>
                                )}
                              </Descriptions.Item>
                              <Descriptions.Item label="Interests">
                                {isEditing ? (
                                  <Form.Item name="interest" noStyle>
                                    <Select
                                      mode="multiple"
                                      className="w-full"
                                      placeholder="Select interests"
                                    >
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
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {candidate.interest &&
                                      candidate.interest
                                        .flatMap((interest) =>
                                          interest.split(",")
                                        )
                                        .map((interest, index) => (
                                          <Tag
                                            key={index}
                                            color="blue"
                                            className="text-sm"
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
                                    <span className="text-gray-700">
                                      {candidate.facialHair}
                                    </span>
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
                                            form.setFieldsValue({
                                              veiled: e.target.checked,
                                            });
                                          }}
                                        >
                                          Oui
                                        </Checkbox>
                                      </Form.Item>
                                      <Form.Item
                                        label="Enceinte"
                                        name="pregnant"
                                        valuePropName="checked"
                                        initialValue={
                                          candidate.pregnant || false
                                        }
                                      >
                                        <Checkbox
                                          onChange={(e) => {
                                            form.setFieldsValue({
                                              pregnant: e.target.checked,
                                            });
                                          }}
                                        >
                                          Oui
                                        </Checkbox>
                                      </Form.Item>
                                    </>
                                  ) : (
                                    <>
                                      {/* Display Mode */}
                                      <Descriptions.Item label="Voilé">
                                        <span className="text-gray-700">
                                          {candidate.veiled ? "Oui" : "Non"}
                                        </span>
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Enceinte">
                                        <span className="text-gray-700">
                                          {candidate.pregnant ? "Oui" : "Non"}
                                        </span>
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
                                  <span className="text-gray-700">
                                    {candidate.town}
                                  </span>
                                )}
                              </Descriptions.Item>
                            </Descriptions>
                          </Col>
                        </Col>
                      </Row>
                      <Form.Item className="text-center">
                        {isEditing ? (
                          <div className="flex justify-center space-x-4 ">
                            <Button
                              type="primary"
                              htmlType="submit"
                              className="px-6 py-2"
                            >
                              Save
                            </Button>
                            <Button
                              type="default"
                              onClick={() => setIsEditing(false)}
                              className="px-6 py-2"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-center mt-4">
                            <Button
                              type="primary"
                              onClick={(e) => handleEditToggle(e)}
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
                        {candidate?.files?.some(
                          (file) =>
                            file.contentType?.startsWith("audio/") ||
                            file.contentType?.startsWith("video/")
                        ) ? (
                          <List
                            itemLayout="vertical"
                            dataSource={candidate.files.filter(
                              (file) =>
                                file.contentType?.startsWith("audio/") ||
                                file.contentType?.startsWith("video/")
                            )}
                            renderItem={(file) => (
                              <List.Item>
                                <List.Item.Meta
                                  title={
                                    <div>
                                      <span style={{ fontWeight: "bold" }}>
                                        <a
                                          href={file.filename}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            color: "inherit",
                                            textDecoration: "none",
                                          }}
                                        >
                                          {file.contentType.startsWith("audio/")
                                            ? "Audio File"
                                            : "Video File"}
                                        </a>
                                      </span>
                                      <span
                                        style={{
                                          marginLeft: "10px",
                                          fontStyle: "italic",
                                          color: "#555",
                                        }}
                                      >
                                        ({file.contentType})
                                      </span>
                                    </div>
                                  }
                                  description={`Type: ${file.contentType}`}
                                />
                                {file.contentType.startsWith("audio/") && (
                                  <audio controls style={{ width: "100%" }}>
                                    <source
                                      src={file.filename}
                                      type={file.contentType}
                                    />
                                    Your browser does not support the audio
                                    element.
                                  </audio>
                                )}
                                {file.contentType.startsWith("video/") && (
                                  <video
                                    controls
                                    style={{
                                      width: "100%", // or set a specific width (e.g., "320px")
                                      maxWidth: "500px", // Limit the maximum width to keep it consistent
                                      height: "280px", // Fixed height for the video
                                      objectFit: "contain", // Ensure the video fills the defined size proportionally
                                      borderRadius: "8px", // Optional for rounded corners
                                      boxShadow:
                                        "0px 4px 6px rgba(0, 0, 0, 0.1)", // Optional for better aesthetics
                                    }}
                                  >
                                    <source
                                      src={file.filename}
                                      type={file.contentType}
                                    />
                                    Your browser does not support the video
                                    element.
                                  </video>
                                )}
                              </List.Item>
                            )}
                          />
                        ) : (
                          <p>
                            No audio or video files available for this
                            candidate.
                          </p>
                        )}
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
                    onClick={handleLikeToggle}
                  >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
        {/* </div> */}
      </Content>
    </Layout>
  );
};

export default CandidateDetails;
  