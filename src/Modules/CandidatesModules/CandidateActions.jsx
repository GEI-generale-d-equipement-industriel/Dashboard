import React, { useState,useEffect } from "react";
import { Button, message, Popconfirm, Upload, Modal, Spin } from "antd";
import { UploadOutlined,  QuestionCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CampaignSelectionModal from "../../components/Modal/Campaings.Modal";
import { useUpdateCampaignProfile } from "../../services/api/campaignService";
import { useRemoveCandidate } from "../../Hooks/useCandidates";
import { useSelector } from "react-redux";
import { MdBookmarkBorder,MdBookmarkAdded } from "react-icons/md";
const CandidateActions = ({
  isEditing,
  handleEditToggle,
  isFavorite,
  role,
  candidateId,  
  campaigns,
  onCreateCampaign,
}) => {
  const canEdit = role === "admin";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [candidateUser, setCandidateUser] = useState(null);

  const { mutate: updateCampaignProfile } = useUpdateCampaignProfile();
  const { mutate: removeCandidate } = useRemoveCandidate();

  const Url = process.env.REACT_APP_API_BASE_URL || "/api";

  const handleHeartClick = () => {
    if (isFavorite) {
      removeFromAllCampaigns();
    } else {
      setModalVisible(true);
    }
  };

  const fetchUser = async (candidateId) => {
    try {
      const res = await axios.get(`${Url}/user/by-candidate/${candidateId}`);
      return res.data._id;
    } catch (error) {
      console.error("Error finding user:", error);
    }
  };

  useEffect(() => {
    if (candidateId) {
      fetchUser(candidateId).then((data) => {
        setCandidateUser(data);
        
      });
    }
  }, [candidateId]);


  const removeFromAllCampaigns = () => {
    const campaignsWithCandidate = campaigns.filter((c) =>
      c.profiles?.some((p) => p === candidateId || p?._id === candidateId)
    );

    if (!campaignsWithCandidate.length) {
      message.warning("Candidate is not in any campaign.");
      return;
    }

    campaignsWithCandidate.forEach((campaign) => {
      updateCampaignProfile(
        {
          campaignId: campaign._id,
          profileId: candidateId,
          action: "remove",
        },
        {
          onSuccess: () => {
            message.success(`Candidate removed from ${campaign.name}!`);
          },
          onError: () => {
            message.error(`Failed to remove candidate from "${campaign.name}".`);
          },
        }
      );
    });
  };

  const handleConfirmCampaignAdd = (campaignId) => {
    const chosenCampaign = campaigns.find((c) => c._id === campaignId);
    

    updateCampaignProfile(
           {
             campaignId,
             profileId: candidateId,
             action: 'add',
           },
           {
             onSuccess: () => {
               // Display a specific message if we have the campaign's name;
               // otherwise, use a generic message.
               if (chosenCampaign) {
                 message.success(`Candidate added to campaign ${chosenCampaign.name}!`);
               } else {
                 message.success("Candidate added to the new campaign!");
               }
             },
             onError: () => {
               message.error('Failed to add candidate to campaign.');
             },
           }
         );

    setModalVisible(false);
  };

  const handleDeleteCandidate = () => {
    removeCandidate(candidateId, {
      onSuccess: () => {
        message.success("Candidate deleted successfully!");
        navigate("/candidates");
      },
      onError: () => {
        message.error("Failed to delete candidate.");
      },
    });
  };

  // Open file upload modal when editing
  const handleEditClick = () => {
    handleEditToggle();
    setUploadModalVisible(true);
  };

  // Handle file selection
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Handle file upload using Axios
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error("Please select a file to upload.");
      return;
    }

    setLoading(true); // Show spinner

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });

    try {
      const response = await axios.patch(`${Url}/candidates/${candidateId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        message.success("Files uploaded successfully!");
        setFileList([]);
        setUploadModalVisible(false);

        // ✅ Re-fetch candidate data to display the new photo immediately
        queryClient.invalidateQueries(["candidate", candidateId]);
      } else {
        throw new Error("Upload failed.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Error uploading files.");
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  const handleSendMessageClick = async () => {
    if (!userId) {
      message.error("User not authenticated.");
      return;
    }
    try {
      const response = await axios.post(`${Url}/conversations/findOrCreate`, {
        participants: [userId, candidateUser],
      });
      const conversation = response.data;
      // Navigate to Chat page with conversationId and candidateId as query parameters.
      navigate(`/chat?conversationId=${conversation._id}&candidateId=${candidateUser}`);
    } catch (error) {
      console.error("Error finding/creating conversation:", error);
      message.error("Could not initiate conversation.");
    }
  };
  return (
    <div className="mt-4 flex justify-center space-x-4">
      {isEditing ? (
        <>
          {canEdit && (
            <>
              <Button type="primary" onClick={handleUpload} disabled={loading}>
                {loading ? <Spin indicator={<LoadingOutlined />} /> : "Save"}
              </Button>
              <Button onClick={handleEditToggle} disabled={loading}>
                Cancel
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          {canEdit && (
            <>
              <Button type="primary" onClick={handleEditClick}>
                Add a new photo
              </Button>

              <Popconfirm
                title="Are you sure to delete this candidate?"
                description="This action cannot be undone."
                onConfirm={handleDeleteCandidate}
                okText="Yes, Delete"
                cancelText="No"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </>
          )}

<Button
  type="text"
  icon={
    isFavorite ? (
      <MdBookmarkAdded className="w-8 h-8 text-blue-600" />
    ) : (
      <MdBookmarkBorder className="w-8 h-8 text-gray-500" />
    )
  }
  onClick={handleHeartClick}
/>
<Button type="primary" onClick={handleSendMessageClick}>
        Send Message
      </Button>
        </>
      )}

      <CampaignSelectionModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        campaigns={campaigns}
        onConfirm={handleConfirmCampaignAdd}
        onCreateCampaign={onCreateCampaign}
      />

      {/* Upload Modal */}
      <Modal
        title="Upload Files"
        visible={isUploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUploadModalVisible(false)} disabled={loading}>
            Cancel
          </Button>,
          <Button key="upload" type="primary" onClick={handleUpload} disabled={loading}>
            {loading ? <Spin indicator={<LoadingOutlined />} /> : "Upload"}
          </Button>,
        ]}
      >
        <Upload
          multiple
          beforeUpload={() => false}
          fileList={fileList}
          onChange={handleFileChange}
          disabled={loading} // Disable file selection during upload
        >
          <Button icon={<UploadOutlined />} disabled={loading}>
            Select Files
          </Button>
        </Upload>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center mt-4">
            <Spin size="large" />
            <p>Uploading...</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CandidateActions;
