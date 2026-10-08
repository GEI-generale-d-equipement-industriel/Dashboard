import React, { useState } from "react";
import { Tooltip, message } from "antd";
import { Link } from "react-router-dom";
import { ManOutlined, WomanOutlined } from "@ant-design/icons";
import { Bookmark, BookmarkCheck, MapPin } from "lucide-react";

import CampaignSelectionModal from "./Modal/Campaings.Modal";
import { useUpdateCampaignProfile } from "../services/api/campaignService";
import {
  INTEREST_SHORT_NAMES,
  titleCase,
  getAge,
  getHeight,
  getInterests,
} from "../utils/candidate";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dqtwi6rca/image/upload/v1733126857/cfoimwrcnfty6hoxiusw.jpg";
const MAX_TAGS = 2;

const CandidateCard = React.memo(
  ({ candidate, fileLink, isFavorite, campaigns, onCreateCampaign }) => {
    const { mutate: updateCampaignProfile } = useUpdateCampaignProfile();
    const [isModalVisible, setModalVisible] = useState(false);

    const age = getAge(candidate);
    const height = getHeight(candidate);
    const interests = getInterests(candidate);
    const isFemale = candidate.gender === "Femme";
    const image = fileLink || candidate.profileImage || DEFAULT_IMAGE;

    // Only the initial of the last name is shown on the list, as before.
    const displayName = `${titleCase(candidate.firstName)} ${
      candidate.name ? `${candidate.name[0].toUpperCase()}.` : ""
    }`.trim();

    const removeFromAllCampaigns = () => {
      const campaignsWithCandidate = campaigns.filter((camp) =>
        camp.profiles?.some((p) => p === candidate._id || p?._id === candidate._id)
      );

      if (!campaignsWithCandidate.length) {
        message.warning("Ce talent n'est dans aucune campagne.");
        return;
      }

      campaignsWithCandidate.forEach((camp) => {
        updateCampaignProfile(
          { campaignId: camp._id, profileId: candidate._id, action: "remove" },
          {
            onSuccess: () => message.success(`Retiré de « ${camp.name} »`),
            onError: () => message.error(`Impossible de retirer ce talent de « ${camp.name} »`),
          }
        );
      });
    };

    const handleSaveClick = () => {
      if (isFavorite) removeFromAllCampaigns();
      else setModalVisible(true);
    };

    const handleConfirm = (campaignId) => {
      const chosenCampaign = campaigns.find((c) => c._id === campaignId);
      updateCampaignProfile(
        { campaignId, profileId: candidate._id, action: "add" },
        {
          onSuccess: () =>
            message.success(
              chosenCampaign
                ? `Ajouté à « ${chosenCampaign.name} »`
                : "Ajouté à la nouvelle campagne"
            ),
          onError: () => message.error("Impossible d'ajouter ce talent à la campagne."),
        }
      );
      setModalVisible(false);
    };

    return (
      <>
        <article className="bm-card">
          <Link
            to={`/candidate/${candidate._id}`}
            className="bm-card__media"
            aria-label={`Voir le profil de ${displayName}`}
          >
            <img
              src={image}
              alt={`${candidate.firstName} ${candidate.name}`}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = DEFAULT_IMAGE;
              }}
            />
            <span className="bm-card__shade" />
            <div className="bm-card__info">
              <h3 className="bm-card__name">{displayName}</h3>
              <p className="bm-card__meta">
                {age !== null && <span>{age} ans</span>}
                {height && <span>{height.toFixed(2)} m</span>}
                {candidate.town && (
                  <span className="bm-card__town">
                    <MapPin size={12} />
                    {candidate.town}
                  </span>
                )}
              </p>
            </div>
          </Link>

          <span
            className={`bm-card__gender ${isFemale ? "is-female" : "is-male"}`}
            title={isFemale ? "Femme" : "Homme"}
          >
            {isFemale ? <WomanOutlined /> : <ManOutlined />}
          </span>

          <Tooltip title={isFavorite ? "Retirer des campagnes" : "Ajouter à une campagne"} placement="left">
            <button
              type="button"
              className={`bm-card__save${isFavorite ? " is-saved" : ""}`}
              onClick={handleSaveClick}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Retirer des campagnes" : "Ajouter à une campagne"}
            >
              {isFavorite ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </Tooltip>

          <div className="bm-card__tags">
            {interests.slice(0, MAX_TAGS).map((interest) => (
              <span key={interest} className="bm-tag">
                {INTEREST_SHORT_NAMES[interest] || interest}
              </span>
            ))}
            {interests.length > MAX_TAGS && (
              <span className="bm-tag bm-tag--more">+{interests.length - MAX_TAGS}</span>
            )}
          </div>
        </article>

        <CampaignSelectionModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          campaigns={campaigns}
          onConfirm={handleConfirm}
          onCreateCampaign={onCreateCampaign}
        />

        {/* SEO JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: `${candidate.firstName} ${candidate.name}`,
            image,
            jobTitle: candidate.jobTitle || "Model",
            url: `${window.location.origin}/candidate/${candidate._id}`,
            gender: candidate.gender,
            birthDate: candidate.birthYear ? `${candidate.birthYear}-01-01` : undefined,
            description: `Age: ${age ?? "n/a"}, Height: ${
              height ? `${height.toFixed(2)}m` : "n/a"
            }, Interests: ${interests.join(", ")}`,
          })}
        </script>
      </>
    );
  },
  (prev, next) =>
    prev.candidate._id === next.candidate._id &&
    prev.isFavorite === next.isFavorite &&
    prev.fileLink === next.fileLink &&
    prev.campaigns === next.campaigns
);

export default CandidateCard;
