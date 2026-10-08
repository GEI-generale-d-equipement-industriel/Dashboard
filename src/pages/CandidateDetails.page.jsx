import React, { useMemo } from "react";
import { message } from "antd";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { AlertTriangle } from "lucide-react";
import axios from "axios";

import BmTheme from "../components/ui/BmTheme";
import CandidateHeader from "../components/Headers/CandidateHeader";
import CandidateDetailsForm from "../components/Forms/CandidateDetailsForm";
import CandidateFilesAndSocialMedia, {
  SocialLinks,
} from "../Modules/CandidatesModules/CandidateFileAndSocialMedia";
import CandidateActions from "../Modules/CandidatesModules/CandidateActions";
import Images from "../components/ImageGallery/images";

import { useGetCampaigns, useCreateCampaign } from "../services/api/campaignService";
import { getBmi, getFullName } from "../utils/candidate";

const NO_CAMPAIGNS = [];

const LoadingState = () => (
  <div className="bm-page bm-detail" aria-busy="true">
    <div className="bm-container">
      <div className="bm-skeleton bm-skeleton--crumb" />
      <div className="bm-detail__grid">
        <div className="bm-skeleton bm-skeleton--gallery" />
        <div className="bm-detail__skeleton-col">
          <div className="bm-skeleton bm-skeleton--title" />
          <div className="bm-skeleton bm-skeleton--stats" />
          <div className="bm-skeleton bm-skeleton--block" />
          <div className="bm-skeleton bm-skeleton--block" />
        </div>
      </div>
    </div>
  </div>
);

const CandidateDetails = () => {
  const { id } = useParams();
  const userId = useSelector((state) => state.auth.id);
  const role = useSelector((state) => state.auth.role);

  const url = process.env.REACT_APP_API_BASE_URL || "/api";

  const {
    data: candidate,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      const res = await axios.get(`${url}/candidates/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: campaigns = NO_CAMPAIGNS } = useGetCampaigns(userId);
  const { mutate: createCampaign } = useCreateCampaign();

  const isFavorite = useMemo(
    () =>
      campaigns.some((campaign) =>
        campaign?.profiles?.some((profile) => profile === candidate?._id || profile?._id === candidate?._id)
      ),
    [campaigns, candidate?._id]
  );

  const handleCreateCampaign = (name, callback) => {
    createCampaign(
      { userId, name },
      {
        onSuccess: (newCampaign) => {
          message.success("Campagne créée avec succès !");
          if (callback && newCampaign?._id) callback(newCampaign._id);
        },
        onError: () => message.error("Échec de la création de la campagne"),
      }
    );
  };

  if (isLoading) {
    return (
      <BmTheme>
        <LoadingState />
      </BmTheme>
    );
  }

  if (error || !candidate) {
    return (
      <BmTheme>
        <div className="bm-page bm-detail">
          <div className="bm-container">
            <div className="bm-state" role="alert">
              <span className="bm-state__icon bm-state__icon--danger">
                <AlertTriangle size={26} />
              </span>
              <h2>Impossible de charger ce profil</h2>
              <p>Vérifiez votre connexion ou réessayez dans un instant.</p>
              <button type="button" className="bm-btn bm-btn--primary" onClick={() => refetch()}>
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </BmTheme>
    );
  }

  const fullName = getFullName(candidate);
  const hasSocial = Boolean(candidate.socialMedia?.length);

  return (
    <BmTheme>
      <div className="bm-page bm-detail">
        <Helmet>
          <title>{fullName} - BeModel</title>
        </Helmet>

        <div className="bm-container">
          <CandidateHeader candidateName={fullName} />

          <div className="bm-detail__grid">
            {/* Left: gallery (stays in view while the details scroll) */}
            <aside className="bm-detail__gallery">
              <Images candidate={candidate} />
              {hasSocial && (
                <div className="bm-detail__social">
                  <SocialLinks candidate={candidate} />
                </div>
              )}
            </aside>

            {/* Right: identity, key figures, actions, details */}
            <main className="bm-detail__main">
              <CandidateDetailsForm
                candidate={candidate}
                bmi={getBmi(candidate)}
                actions={
                  <CandidateActions
                    isFavorite={isFavorite}
                    role={role}
                    candidateId={candidate._id}
                    campaigns={campaigns}
                    onCreateCampaign={handleCreateCampaign}
                  />
                }
              />
            </main>
          </div>

          <CandidateFilesAndSocialMedia candidate={candidate} />
        </div>
      </div>
    </BmTheme>
  );
};

export default CandidateDetails;
