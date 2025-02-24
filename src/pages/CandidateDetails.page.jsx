import React, {  useState, useMemo } from "react";
import { Layout, Skeleton, Card, Row, Col, Form,message } from "antd";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// import isEqual from "lodash/isEqual";

import CandidateHeader from "../components/Headers/CandidateHeader";
import CandidateImageGallery from "../components/ImageGallery/CandidateImageGallery";
import CandidateDetailsForm from "../components/Forms/CandidateDetailsForm";
import CandidateFilesAndSocialMedia from "../Modules/CandidatesModules/CandidateFileAndSocialMedia";
import CandidateActions from "../Modules/CandidatesModules/CandidateActions";

import useToggleFavorite from "../Hooks/useToggleFavorite";
import { useFetchFavorites } from "../services/api/favoritesService";
import { useGetCampaigns,useCreateCampaign } from "../services/api/campaignService";
import { use } from "react";
const { Content } = Layout;

const CandidateDetails = () => {
  const { id } = useParams();
  const userId = useSelector((state) => state.auth.id);
  const role =useSelector((state) => state.auth.role);
  
  

  // const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const url = process.env.REACT_APP_API_BASE_URL || "/api";

  // Fetch candidate data
  const { data: candidate, isLoading, error } = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      const res = await axios.get(`${url}/candidates/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: campaigns = [] } = useGetCampaigns(userId);
  const { mutate: createCampaign } = useCreateCampaign();
  // Fetch favorites
  const { data: favorites = [] } = useFetchFavorites(userId);
  const toggleFavorite = useToggleFavorite(userId, favorites);

  // Extract image files
  const imageFiles = useMemo(() => {
    return (
      candidate?.files?.filter(
        (file) => file.contentType && file.contentType.startsWith("image/")&&!file.filename.includes("video") 
      ) || []
    );
  }, [candidate]);

  // Determine if the candidate is a favorite

const campaignProfileIds = useMemo(() => {
    const allIds = new Set();
    campaigns.forEach((campaign) => {
      // Ensure the campaign has a `profiles` array
      if (campaign?.profiles) {
        campaign.profiles.forEach((profileId) => {
          allIds.add(profileId);
        });
      }
    });
    return allIds;
  }, [campaigns]);
  
    const isFavorite = campaignProfileIds.has(candidate?._id);
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };
  const handleCreateCampaign = (name, callback) => {
    createCampaign({ userId, name }, {
      onSuccess: (newCampaign) => {
        message.success('Campaign created successfully!');
        // If a callback is provided and newCampaign has an _id, invoke the callback.
        if (callback && newCampaign?._id) {
          callback(newCampaign._id);
        }
      },
      onError: () => message.error('Failed to create campaign'),
    });
  };
  // const handleSave = async (values) => {
  //   const currentValues = form.getFieldsValue();
  //   const initialValues = form.getFieldsValue(true);

  //   if (isEqual(currentValues, initialValues)) {
  //     notification.warning({
  //       message: "No Changes",
  //       description: "No changes detected to save.",
  //     });
  //     return;
  //   }

  //   try {
  //     await axios.put(`${url}/candidates/${id}`, values);
  //     notification.success({
  //       message: "Success",
  //       description: "Candidate details updated successfully.",
  //     });
  //     setIsEditing(false);
  //     queryClient.invalidateQueries(["candidate", id]);
  //   } catch (error) {
  //     notification.error({
  //       message: "Error",
  //       description: "Failed to update candidate details.",
  //     });
  //   }
  // };

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
    <Layout style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Content style={{ padding: "8px", maxWidth: "1200px", margin: "0 auto" }}>
        <CandidateHeader />

        {/* Main Row: Image Gallery and Candidate Details */}
        <Row gutter={[32, 32]} justify="center" align="top">
          <Col xs={24} md={12} style={{ paddingRight: "64px" }}>
            <CandidateImageGallery imageFiles={imageFiles} />
          </Col>
          <Col xs={24} md={12} style={{ paddingLeft: "64px" }}>
            <Card
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CandidateDetailsForm
                candidate={candidate}
                isEditing={isEditing}
                form={form}
                bmi={bmi}
                role={userId.role}
                
              />
              <CandidateActions
                isEditing={isEditing}
                handleEditToggle={handleEditToggle}
                isFavorite={isFavorite}
                handleLikeToggle={() =>
                  toggleFavorite({
                    candidateId: candidate._id,
                    action: isFavorite ? "remove" : "add",
                  })
                }
                role={role}
                candidateId={candidate._id}
  campaigns={campaigns}               // an array of campaigns
  onCreateCampaign={handleCreateCampaign}
              />
            </Card>
          </Col>
        </Row>

        {/* Second Row: Files and Social Media */}
        <Row
          gutter={[24, 24]}
          style={{ marginTop: "24px", paddingBottom: "24px" }}
        >
          <Col span={24}>
            <CandidateFilesAndSocialMedia candidate={candidate} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default CandidateDetails;
