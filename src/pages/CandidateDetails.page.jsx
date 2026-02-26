import React, { useState, useMemo } from "react";
import { Skeleton, Form, message } from "antd";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import CandidateHeader from "../components/Headers/CandidateHeader";
import CandidateDetailsForm from "../components/Forms/CandidateDetailsForm";
import CandidateFilesAndSocialMedia from "../Modules/CandidatesModules/CandidateFileAndSocialMedia";
import CandidateActions from "../Modules/CandidatesModules/CandidateActions";
import Images from "../components/ImageGallery/images";

import { useGetCampaigns, useCreateCampaign } from "../services/api/campaignService";

const CandidateDetails = () => {
  const { id } = useParams();
  const userId = useSelector((state) => state.auth.id);
  const role = useSelector((state) => state.auth.role);

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const url = process.env.REACT_APP_API_BASE_URL || "/api";

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

  const campaignProfileIds = useMemo(() => {
    const allIds = new Set();
    campaigns.forEach((campaign) => {
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
        message.success('Campagne créée avec succès !');
        if (callback && newCampaign?._id) {
          callback(newCampaign._id);
        }
      },
      onError: () => message.error('Échec de la création de la campagne'),
    });
  };

  const weight = candidate ? parseFloat(candidate.weight) : 0;
  const height = candidate ? parseFloat(candidate.height) : 1;
  const bmi = weight / height ** 2;

  // ─── Loading State ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <Skeleton.Button active shape="round" style={{ width: 100, marginBottom: 24 }} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton.Image active style={{ width: '100%', height: 480, borderRadius: 20 }} />
            <div className="space-y-4">
              <Skeleton active paragraph={{ rows: 12 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────────────────────
  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-red-100 rounded-2xl shadow p-10 text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-slate-700 mb-2">Impossible de charger ce profil</h2>
          <p className="text-slate-400 text-sm">Veuillez vérifier votre connexion ou réessayer plus tard.</p>
        </div>
      </div>
    );
  }

  // ─── Page ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">

        {/* Back navigation */}
        <CandidateHeader candidateName={`${candidate.firstName} ${candidate.name}`} />

        {/* ── Hero: Image + Details ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left – Image Gallery */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
            <Images candidate={candidate} />
          </div>

          {/* Right – Info + Actions */}
          <div className="flex flex-col gap-6 w-full min-w-0">

            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <CandidateDetailsForm
                candidate={candidate}
                isEditing={isEditing}
                form={form}
                bmi={bmi}
                role={role}
              />
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5">
              <CandidateActions
                isEditing={isEditing}
                handleEditToggle={handleEditToggle}
                isFavorite={isFavorite}
                role={role}
                candidateId={candidate._id}
                campaigns={campaigns}
                onCreateCampaign={handleCreateCampaign}
              />
            </div>
          </div>
        </div>

        {/* ── Files & Social Media ────────────────────────────────────────── */}
        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full inline-block" />
            Fichiers & Réseaux sociaux
          </h2>
          <CandidateFilesAndSocialMedia candidate={candidate} />
        </div>

      </div>
    </div>
  );
};

export default CandidateDetails;
