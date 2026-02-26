import React, { useState, useEffect } from "react";
import { Button, message, Popconfirm, Upload, Modal, Spin, Tooltip } from "antd";
import {
  UploadOutlined,
  QuestionCircleOutlined,
  LoadingOutlined,
  DeleteOutlined,
  MessageOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CampaignSelectionModal from "../../components/Modal/Campaings.Modal";
import { useUpdateCampaignProfile } from "../../services/api/campaignService";
import { useRemoveCandidate } from "../../Hooks/useCandidates";
import { useSelector } from "react-redux";
import { MdBookmarkBorder, MdBookmarkAdded } from "react-icons/md";

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
        { campaignId: campaign._id, profileId: candidateId, action: "remove" },
        {
          onSuccess: () => message.success(`Candidate removed from ${campaign.name}!`),
          onError: () => message.error(`Failed to remove candidate from "${campaign.name}".`),
        }
      );
    });
  };

  const handleConfirmCampaignAdd = (campaignId) => {
    const chosenCampaign = campaigns.find((c) => c._id === campaignId);
    updateCampaignProfile(
      { campaignId, profileId: candidateId, action: "add" },
      {
        onSuccess: () =>
          message.success(
            chosenCampaign
              ? `Candidate added to campaign ${chosenCampaign.name}!`
              : "Candidate added to the new campaign!"
          ),
        onError: () => message.error("Failed to add candidate to campaign."),
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
      onError: () => message.error("Failed to delete candidate."),
    });
  };

  const handleEditClick = () => {
    handleEditToggle();
    setUploadModalVisible(true);
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error("Please select a file to upload.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", file.originFileObj));
    try {
      const response = await axios.patch(`${Url}/candidates/${candidateId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200 || response.status === 201) {
        message.success("Files uploaded successfully!");
        setFileList([]);
        setUploadModalVisible(false);
        queryClient.invalidateQueries(["candidate", candidateId]);
      } else {
        throw new Error("Upload failed.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Error uploading files.");
    } finally {
      setLoading(false);
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
      navigate(`/chat?conversationId=${conversation._id}&candidateId=${candidateUser}`);
    } catch (error) {
      console.error("Error finding/creating conversation:", error);
      message.error("Could not initiate conversation.");
    }
  };

  return (
    <div className="w-full">
      {/* ── Bookmark pill ─────────────────────────────────────────────────── */}
      <div className="flex gap-2 w-full mb-4">
        <Tooltip title={isFavorite ? "Retirer des campagnes" : "Ajouter à une campagne"}>
          <button
            onClick={handleHeartClick}
            className={`
              flex items-center gap-1.5 px-4 py-2.5  rounded-full text-sm font-bold border transition-all duration-200
              ${isFavorite
                ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                : "bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
              }
            `}
          >
            {isFavorite
              ? <MdBookmarkAdded className="w-4 h-4" />
              : <MdBookmarkBorder className="w-4 h-4" />
            }
            {/* <span>{isFavorite ? "Sauvegardé" : "Sauvegarder"}</span> */}
          </button>
        </Tooltip>
      

      {/* ── Action buttons ────────────────────────────────────────────────── */}
      {isEditing ? (
        /* Editing state */
        <div className="flex gap-3 w-full">
          {canEdit && (
            <div className="flex-1">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-sm shadow-blue-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <Spin indicator={<LoadingOutlined style={{ color: "#fff" }} />} />
                  : <><SaveOutlined /> Enregistrer</>
                }
              </button>
            </div>
          )}
          {canEdit && (
            <div className="flex-1">
              <button
                onClick={handleEditToggle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold border border-slate-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <CloseOutlined /> Annuler
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Default state */
        <div className="flex gap-3 w-full">
          {/* Send message – always visible */}
          <div className="flex-1">
            <button
              onClick={handleSendMessageClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-sm shadow-blue-200 transition-all duration-200"
            >
              <MessageOutlined /> Message
            </button>
          </div>

          {/* Add photo – admin only */}
          {canEdit && (
            <div className="flex-1">
              <button
                onClick={handleEditClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-sm font-semibold transition-all duration-200"
              >
                <PlusOutlined /> Photo
              </button>
            </div>
          )}

          {/* Delete – admin only */}
          {canEdit && (
            <div className="flex-1">
              <Popconfirm
                title="Supprimer ce candidat ?"
                description="Cette action est irréversible."
                onConfirm={handleDeleteCandidate}
                okText="Oui, supprimer"
                cancelText="Annuler"
                icon={<QuestionCircleOutlined style={{ color: "#ef4444" }} />}
                okButtonProps={{ danger: true }}
              >
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 text-red-500 hover:text-red-600 text-sm font-semibold transition-all duration-200">
                  <DeleteOutlined />
                </button>
              </Popconfirm>
            </div>
          )}
        </div>
      )}

      {/* ── Campaign selection modal ───────────────────────────────────────── */}
      <CampaignSelectionModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        campaigns={campaigns}
        onConfirm={handleConfirmCampaignAdd}
        onCreateCampaign={onCreateCampaign}
      />

      {/* ── Upload modal ──────────────────────────────────────────────────── */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <UploadOutlined />
            <span>Ajouter des fichiers</span>
          </div>
        }
        open={isUploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setUploadModalVisible(false)}
            disabled={loading}
          >
            Annuler
          </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={handleUpload}
            disabled={loading}
            icon={loading ? <Spin indicator={<LoadingOutlined />} /> : <UploadOutlined />}
          >
            {loading ? "Envoi en cours..." : "Envoyer"}
          </Button>,
        ]}
      >
        <Upload
          multiple
          beforeUpload={() => false}
          fileList={fileList}
          onChange={handleFileChange}
          disabled={loading}
          className="w-full"
          listType="picture"
        >
          <Button icon={<UploadOutlined />} disabled={loading} className="w-full">
            Sélectionner des fichiers
          </Button>
        </Upload>

        {loading && (
          <div className="text-center mt-6">
            <Spin size="large" />
            <p className="mt-2 text-slate-500 text-sm">Envoi en cours...</p>
          </div>
        )}
      </Modal>
      </div>
    </div>
  );
};

export default CandidateActions;
