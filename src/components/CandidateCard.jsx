import React, { useState } from 'react';
import { Card, Button, Tooltip, Tag, message } from 'antd';
import { Link } from 'react-router-dom';
import CampaignSelectionModal from './Modal/Campaings.Modal';
import { useUpdateCampaignProfile } from '../services/api/campaignService';
// import BmiIndicateur from './BmiIndicateur';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import { MdBookmarkBorder, MdBookmarkAdded } from "react-icons/md";
// Mapping for interest names (optional)
const interestShortNames = {
  'Modèle pour shooting': 'Model',
  'Modèle pour shooting en studio': 'Model',
  'Créateur UGC': 'UGC',
  "Voix-off": "Voix"
  // Add more mappings if needed
};

const CandidateCard = React.memo(
  ({
    candidate,
    fileLink,
    isFavorite,         // true if candidate is in any campaign
    tagColors,
    campaigns,
    onCreateCampaign,   // callback for creating new campaigns from the modal
  }) => {

    const { mutate: updateCampaignProfile } = useUpdateCampaignProfile();

    // Local state for campaign selection modal visibility
    const [isModalVisible, setModalVisible] = useState(false);

    // Fallback image if none provided
    const defaultImage =
      'https://res.cloudinary.com/dqtwi6rca/image/upload/v1733126857/cfoimwrcnfty6hoxiusw.jpg';


    // Compute candidate stats
    const year = parseInt(candidate?.birthDate?.substring(0, 4))
    const currentYear = new Date().getFullYear();
    const age = currentYear - (candidate.birthYear ? candidate.birthYear : year || 2000);
    // const weight = parseFloat(candidate.weight) || 0;
    const height = parseFloat(candidate.height) || 1;
    // const bmi = weight / (height * height);

    /**
     * Clicking the bookmark icon:
     * - If candidate is already in a campaign, remove them.
     * - Otherwise, open the modal so the user can add the candidate.
     */
    const handleBookmarkClick = () => {
      if (isFavorite) {
        removeFromAllCampaigns();
      } else {
        setModalVisible(true);
      }
    };

    const removeFromAllCampaigns = () => {
      const campaignsWithCandidate = campaigns.filter((camp) =>
        camp.profiles?.some(
          (p) => p === candidate._id || p?._id === candidate._id
        )
      );

      if (!campaignsWithCandidate.length) {
        message.warning('Candidate is not in any campaign.');
        return;
      }

      campaignsWithCandidate.forEach((camp) => {
        updateCampaignProfile(
          {
            campaignId: camp._id,
            profileId: candidate._id,
            action: 'remove',
          },
          {
            onSuccess: () => {
              message.success(`Candidate removed from ${camp.name}!`);
              // Optionally invalidate queries via queryClient.invalidateQueries(...)
            },
            onError: () => {
              message.error(`Failed to remove candidate from "${camp.name}".`);
            },
          }
        );
      });
    };

    /**
     * Called when a campaign is chosen in the modal for adding the candidate.
     */
    const handleConfirm = (campaignId) => {
      // Try to find the campaign in the local campaigns list.
      const chosenCampaign = campaigns.find((c) => c._id === campaignId);
      // Proceed with the update regardless of whether it was found locally.
      updateCampaignProfile(
        {
          campaignId,
          profileId: candidate._id,
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



    // Determine the gender icon (using lucide‑react)
    const genderIcon =
      candidate.gender === 'Femme' ? (
        <div className="text-pink-500 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm flex items-center justify-center">
          <WomanOutlined className="text-base" />
        </div>
      ) : (
        <div className="text-blue-500 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm flex items-center justify-center">
          <ManOutlined className="text-base" />
        </div>
      );

    return (
      <>
        <div className="group relative w-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
          {/* Image Section */}
          <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50">
            <Link to={`/candidate/${candidate._id}`} className="block w-full h-full">
              <img
                src={fileLink || candidate.profileImage || defaultImage}
                alt={`${candidate.firstName} ${candidate.name}'s profile`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </Link>

            {/* Bookmark Button Floating Top Right */}
            <div className="absolute top-3 right-3 z-10">
              <Tooltip
                title={
                  isFavorite
                    ? "Remove from campaigns"
                    : "Add to a campaign"
                }
                placement="left"
              >
                <button
                  onClick={handleBookmarkClick}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-105 transition-all duration-200 focus:outline-none"
                >
                  {isFavorite ? (
                    <MdBookmarkAdded className="w-5 h-5 text-blue-600" />
                  ) : (
                    <MdBookmarkBorder className="w-5 h-5 text-gray-700 hover:text-blue-600 transition-colors" />
                  )}
                </button>
              </Tooltip>
            </div>

            {/* Gender Badge Floating Top Left */}
            <div className="absolute top-3 left-3 z-10">
              {genderIcon}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 flex flex-col flex-grow">
            <Link
              to={`/candidate/${candidate._id}`}
              className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 mb-1.5"
            >
              {candidate.firstName.charAt(0).toUpperCase() + candidate.firstName.slice(1)} {candidate.name?.[0]?.toUpperCase()}.
            </Link>

            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-4">
              <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md">
                <span className="font-semibold text-gray-900">{age}</span> ans
              </span>
              <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md">
                <span className="font-semibold text-gray-900">{height.toFixed(2)}</span> m
              </span>
            </div>

            {/* Tags Footer */}
            <div className="mt-auto pt-3 border-t border-gray-100 flex gap-1.5 flex-wrap">
              {candidate.interest
                ?.flatMap((interest) => interest.split(","))
                .slice(0, 3) // Preview up to 3 tags
                .map((interestItem, index) => {
                  const trimmed = interestItem.trim();
                  const shortInterest = interestShortNames[trimmed] || trimmed;
                  // Provide some subtle colors based on index
                  const bgColors = ["bg-blue-50 text-blue-700 border-blue-100", "bg-purple-50 text-purple-700 border-purple-100", "bg-emerald-50 text-emerald-700 border-emerald-100"];
                  const colorClass = bgColors[index % bgColors.length];
                  return (
                    <span
                      key={index}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}
                    >
                      {shortInterest}
                    </span>
                  );
                })}
              {candidate.interest && candidate.interest.flatMap((i) => i.split(",")).length > 3 && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                  +{candidate.interest.flatMap((i) => i.split(",")).length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Campaign Selection Modal */}
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
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: `${candidate.firstName} ${candidate.name}`,
            image: fileLink || candidate.profileImage || defaultImage,
            jobTitle: candidate.jobTitle || 'Model',
            url: `${window.location.origin}/candidate/${candidate._id}`,
            gender: candidate.gender,
            birthDate: candidate.birthYear
              ? `${candidate.birthYear}-01-01`
              : undefined,
            description: `Age: ${age}, Height: ${height.toFixed(
              2
            )}m, Interests: ${candidate.interest?.join(', ')}`,
          })}
        </script>
      </>
    );
  },
  (prevProps, nextProps) =>
    prevProps.candidate._id === nextProps.candidate._id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.fileLink === nextProps.fileLink
);

export default CandidateCard;
