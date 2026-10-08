import React, { useEffect, useState } from "react";
import { Modal, Popconfirm, Tooltip, Upload, message } from "antd";
import {
  Bookmark,
  BookmarkCheck,
  ImagePlus,
  Loader2,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import CampaignSelectionModal from "../../components/Modal/Campaings.Modal";
import { useUpdateCampaignProfile } from "../../services/api/campaignService";
import { useRemoveCandidate } from "../../Hooks/useCandidates";

const CandidateActions = ({
  isFavorite,
  role,
  candidateId,
  campaigns,
  onCreateCampaign,
}) => {
  const isAdmin = role === "admin";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);

  const [isCampaignModalVisible, setCampaignModalVisible] = useState(false);
  const [isUploadModalVisible, setUploadModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  // The messaging account linked to this candidate: undefined = loading, null = none.
  const [candidateUser, setCandidateUser] = useState(undefined);
  const [openingChat, setOpeningChat] = useState(false);

  const { mutate: updateCampaignProfile } = useUpdateCampaignProfile();
  const { mutate: removeCandidate, isPending: deleting } = useRemoveCandidate();

  const baseUrl = process.env.REACT_APP_API_BASE_URL || "/api";

  useEffect(() => {
    if (!candidateId) return undefined;
    let cancelled = false;
    setCandidateUser(undefined);
    axios
      .get(`${baseUrl}/user/by-candidate/${candidateId}`)
      .then((res) => !cancelled && setCandidateUser(res.data?._id || null))
      .catch(() => !cancelled && setCandidateUser(null));
    return () => {
      cancelled = true;
    };
  }, [candidateId, baseUrl]);

  // ── Campaigns ────────────────────────────────────────────────────────────
  const removeFromAllCampaigns = () => {
    const withCandidate = campaigns.filter((c) =>
      c.profiles?.some((p) => p === candidateId || p?._id === candidateId)
    );

    if (!withCandidate.length) {
      message.warning("Ce talent n'est dans aucune campagne.");
      return;
    }

    withCandidate.forEach((campaign) => {
      updateCampaignProfile(
        { campaignId: campaign._id, profileId: candidateId, action: "remove" },
        {
          onSuccess: () => message.success(`Retiré de « ${campaign.name} »`),
          onError: () => message.error(`Impossible de retirer ce talent de « ${campaign.name} »`),
        }
      );
    });
  };

  const handleCampaignToggle = () => {
    if (isFavorite) removeFromAllCampaigns();
    else setCampaignModalVisible(true);
  };

  const handleConfirmCampaignAdd = (campaignId) => {
    const chosen = campaigns.find((c) => c._id === campaignId);
    updateCampaignProfile(
      { campaignId, profileId: candidateId, action: "add" },
      {
        onSuccess: () =>
          message.success(
            chosen ? `Ajouté à « ${chosen.name} »` : "Ajouté à la nouvelle campagne"
          ),
        onError: () => message.error("Impossible d'ajouter ce talent à la campagne."),
      }
    );
    setCampaignModalVisible(false);
  };

  // ── Admin: delete ─────────────────────────────────────────────────────────
  const handleDeleteCandidate = () => {
    removeCandidate(candidateId, {
      onSuccess: () => {
        message.success("Talent supprimé.");
        navigate("/candidates");
      },
      onError: () => message.error("Impossible de supprimer ce talent."),
    });
  };

  // ── Admin: upload ─────────────────────────────────────────────────────────
  const closeUploadModal = () => {
    if (uploading) return;
    setUploadModalVisible(false);
    setFileList([]);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error("Sélectionnez au moins un fichier.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", file.originFileObj));
    try {
      const response = await axios.patch(`${baseUrl}/candidates/${candidateId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200 || response.status === 201) {
        message.success("Fichiers envoyés avec succès.");
        setFileList([]);
        setUploadModalVisible(false);
        queryClient.invalidateQueries({ queryKey: ["candidate", candidateId] });
      } else {
        throw new Error("Upload failed.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Erreur lors de l'envoi des fichiers.");
    } finally {
      setUploading(false);
    }
  };

  // ── Messaging ─────────────────────────────────────────────────────────────
  const handleSendMessageClick = async () => {
    if (!userId) {
      message.error("Vous devez être connecté.");
      return;
    }
    setOpeningChat(true);
    try {
      const response = await axios.post(`${baseUrl}/conversations/findOrCreate`, {
        participants: [userId, candidateUser],
      });
      navigate(`/chat?conversationId=${response.data._id}&candidateId=${candidateUser}`);
    } catch (error) {
      console.error("Error finding/creating conversation:", error);
      message.error("Impossible de démarrer la conversation.");
      setOpeningChat(false);
    }
  };

  const messageDisabled = candidateUser === undefined || candidateUser === null || openingChat;
  const messageTooltip =
    candidateUser === null ? "Ce talent n'a pas encore de compte de messagerie." : "";

  return (
    <div className="bm-actions">
      <Tooltip title={messageTooltip}>
        <span className="bm-actions__primary">
          <button
            type="button"
            className="bm-btn bm-btn--primary bm-btn--lg bm-btn--block"
            onClick={handleSendMessageClick}
            disabled={messageDisabled}
          >
            {openingChat || candidateUser === undefined ? (
              <Loader2 size={18} className="bm-spin" />
            ) : (
              <MessageCircle size={18} />
            )}
            Envoyer un message
          </button>
        </span>
      </Tooltip>

      <button
        type="button"
        className={`bm-btn bm-btn--lg ${isFavorite ? "bm-btn--saved" : "bm-btn--ghost"}`}
        onClick={handleCampaignToggle}
        aria-pressed={isFavorite}
      >
        {isFavorite ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        {isFavorite ? "Dans une campagne" : "Ajouter à une campagne"}
      </button>

      {isAdmin && (
        <div className="bm-actions__admin">
          <span className="bm-actions__admin-label">Administration</span>
          <button
            type="button"
            className="bm-btn bm-btn--ghost bm-btn--sm"
            onClick={() => setUploadModalVisible(true)}
          >
            <ImagePlus size={16} />
            Ajouter des photos
          </button>
          <Popconfirm
            title="Supprimer ce talent ?"
            description="Cette action est irréversible."
            onConfirm={handleDeleteCandidate}
            okText="Oui, supprimer"
            cancelText="Annuler"
            okButtonProps={{ danger: true, loading: deleting }}
          >
            <button type="button" className="bm-btn bm-btn--danger-ghost bm-btn--sm">
              <Trash2 size={16} />
              Supprimer
            </button>
          </Popconfirm>
        </div>
      )}

      <CampaignSelectionModal
        visible={isCampaignModalVisible}
        onClose={() => setCampaignModalVisible(false)}
        campaigns={campaigns}
        onConfirm={handleConfirmCampaignAdd}
        onCreateCampaign={onCreateCampaign}
      />

      <Modal
        title={<div className="bm-modal-title">Ajouter des photos & fichiers</div>}
        open={isUploadModalVisible}
        onCancel={closeUploadModal}
        maskClosable={!uploading}
        className="bm-modal"
        footer={
          <div className="bm-modal-footer">
            <button
              type="button"
              className="bm-btn bm-btn--ghost"
              onClick={closeUploadModal}
              disabled={uploading}
            >
              Annuler
            </button>
            <button
              type="button"
              className="bm-btn bm-btn--primary"
              onClick={handleUpload}
              disabled={uploading || fileList.length === 0}
            >
              {uploading && <Loader2 size={16} className="bm-spin" />}
              {uploading ? "Envoi en cours…" : `Envoyer${fileList.length ? ` (${fileList.length})` : ""}`}
            </button>
          </div>
        }
      >
        <Upload.Dragger
          multiple
          beforeUpload={() => false}
          fileList={fileList}
          onChange={({ fileList: next }) => setFileList(next)}
          disabled={uploading}
          listType="picture"
          className="bm-dragger"
        >
          <p className="bm-dragger__title">Glissez vos fichiers ici</p>
          <p className="bm-dragger__hint">ou cliquez pour parcourir · images, vidéos, audio</p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
};

export default CandidateActions;
