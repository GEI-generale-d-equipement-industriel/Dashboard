import React, {  useState, useMemo } from "react";
import { Layout, Skeleton, Card, Row, Col, Form } from "antd";
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

const { Content } = Layout;

const CandidateDetails = () => {
  const { id } = useParams();
  const userId = useSelector((state) => state.auth.id);

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

  // Fetch favorites
  const { data: favorites = [] } = useFetchFavorites(userId);
  const toggleFavorite = useToggleFavorite(userId, favorites);

  // Extract image files
  const imageFiles = useMemo(() => {
    return (
      candidate?.files?.filter(
        (file) => file.contentType && file.contentType.startsWith("image/")
      ) || []
    );
  }, [candidate]);

  // Determine if the candidate is a favorite
  const isFavorite = useMemo(
    () => favorites.some((fav) => fav._id === candidate?._id),
    [favorites, candidate]
  );

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
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
                role={userId.role}
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
